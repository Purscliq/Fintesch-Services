"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = exports.createToken = void 0;
//IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../../models/User");
const generate_otp_1 = require("../utils/generate_otp");
const send_mail_1 = require("../utils/send_mail");
(0, dotenv_1.config)();
const secretKey = process.env.secretKey;
const domain = process.env.DOMAIN;
const key = process.env.api_key;
// TOKEN CREATION FUNCTION
const createToken = (email, userId) => {
    const payload = { email, userId };
    if (!secretKey)
        throw new Error(' token key is undefined');
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: "1d" });
};
exports.createToken = createToken;
// AUTHENTICATE CLASS
class Authenticate {
    constructor() {
        this.signUp = async (req, res) => {
            try {
                const { email, password, confirmPassword } = req.body;
                const checksIfUserExists = await User_1.User.findOne({ email }).select("email");
                if (checksIfUserExists) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send('This user already exists.');
                }
                if (password !== confirmPassword) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send('Password must match');
                }
                const securePassword = await bcrypt_1.default.hash(password, bcrypt_1.default.genSaltSync(10));
                const user = new User_1.User({ email, password: securePassword });
                user.OTP = (0, generate_otp_1.generateOTP)();
                await user.save();
                // Send OTP to Mail
                const mailText = `<p> Welcome to e-Tranzact. Your One-Time password for your e-Tranzact account is ${user.OTP}.
            Password is valid for 20 minutes.</p>`;
                const messageData = {
                    from: 'e-Tranzact <jon@gmail.com>',
                    to: email,
                    subject: 'Verify Your Account',
                    html: mailText
                };
                (0, send_mail_1.sendMail)(domain, key, messageData);
                const userCount = await User_1.User.countDocuments({});
                if (userCount === 0) {
                    user.role = "Admin";
                    await user.save();
                }
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    Success: "USER PROFILE CREATED SUCCESSFULLY!",
                    message: "A One-Time Password has been sent to your mail",
                    OTP: user.OTP
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
            }
        };
        // USER LOGIN METHOD
        this.signIn = async (req, res) => {
            try {
                const { email, password } = req.body;
                const profile = await User_1.User.findOne({ email }).select("email password");
                if (!profile)
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "This user is " + http_status_codes_1.ReasonPhrases.NOT_FOUND });
                const isPasswordMatch = await bcrypt_1.default.compare(password, profile.password);
                if (!isPasswordMatch)
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "The password you entered is incorrect" });
                const token = (0, exports.createToken)(profile.email, profile._id);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ token, profile });
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
            }
        };
    }
}
exports.Authenticate = Authenticate;
