"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const dotenv_1 = require("dotenv");
const User_1 = require("../../models/User");
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generate_otp_1 = require("../utils/generate_otp");
const send_mail_1 = require("../utils/send_mail");
const token_service_1 = require("./utils/token_service");
(0, dotenv_1.config)();
class Auth {
    constructor() {
        this.signup = async (req, res) => {
            try {
                const { email, password, confirmPassword } = req.body;
                const checksIfUserExists = await User_1.User.findOne({ email }).select("email");
                if (checksIfUserExists)
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json('This user already exists.');
                if (password !== confirmPassword)
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json('Password must match');
                const securePassword = await bcrypt_1.default.hash(password, bcrypt_1.default.genSaltSync(10));
                const user = new User_1.User({
                    email,
                    password: securePassword
                });
                user.OTP = this.OTP;
                await user.save();
                const messageData = {
                    from: 'e-Tranzact <jon@gmail.com>',
                    to: email,
                    subject: 'Verify Your Account',
                    html: this.mailText
                };
                send_mail_1.SendMail.send(this.domain, this.key, messageData);
                const userCount = await User_1.User.countDocuments({});
                if (userCount === 0) {
                    user.role = "Admin";
                    await user.save();
                }
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    Success: "USER PROFILE CREATED SUCCESSFULLY!",
                    message: "A One-Time Password has been sent to your mail",
                    // OTP: user.OTP
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
            }
        };
        this.domain = process.env.DOMAIN;
        this.key = process.env.mailgun_key;
        this.OTP = new generate_otp_1.GenerateOTP().instantiate();
        this.mailText = `<p> Welcome to e-Tranzact. Your One-Time password for your e-Tranzact account is ${this.OTP}. Password is valid for 20 minutes.</p>`;
        this.token = new token_service_1.Token;
    }
    async signin(req, res) {
        try {
            const { email, password } = req.body;
            const profile = await User_1.User.findOne({ email }).select("email password");
            if (!profile)
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: "This user is " + http_status_codes_1.ReasonPhrases.NOT_FOUND
                });
            const isPasswordMatch = await bcrypt_1.default.compare(password, profile.password);
            if (!isPasswordMatch)
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: "The password you entered is incorrect"
                });
            const token = this.token.create(profile.email, profile._id, profile.role, profile.isVerified);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                token,
                profile
            });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }
    ;
    async signout(req, res) {
        try {
            return req.headers.authorization = undefined;
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(http_status_codes_1.ReasonPhrases.BAD_REQUEST);
        }
    }
}
exports.Auth = Auth;
