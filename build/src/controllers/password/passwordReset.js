"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
// IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../models/User");
const sendPasswordResetOTP_1 = require("./sendPasswordResetOTP");
const decodeToken_1 = require("../utils/decodeToken");
(0, dotenv_1.config)();
// verify user email and send list
class ResetPassword {
    constructor() {
        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                (0, sendPasswordResetOTP_1.verifyResetEmailAndSendOTP)(req, res, email);
            }
            catch (error) {
                console.log(error);
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(error.message);
            }
        };
        this.verifyOTP = async (req, res) => {
            try {
                const { OTP } = req.body;
                const user = await User_1.User.findOne({ OTP });
                if (!OTP || OTP !== user.OTP)
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("A valid One-time password is needed");
                return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "OK" });
            }
            catch (error) {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
            }
        };
        // Update password in the database
        this.resetPassword = async (req, res) => {
            try {
                const { newPassword, confirmPassword } = req.body;
                const authHeader = req.headers.authorization;
                const data = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
                const user = await User_1.User.findById(data.userId);
                if (!user) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("User not found");
                }
                if (newPassword !== confirmPassword) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("Passwords must match");
                }
                const verifyPassword = await bcrypt_1.default.compare(newPassword, user.password);
                if (verifyPassword) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("You cannot use an old password");
                }
                const securePass = await bcrypt_1.default.hash(newPassword, bcrypt_1.default.genSaltSync(10));
                const updatedUser = await User_1.User.findOneAndUpdate({ _id: data.userId }, { password: securePass }, { new: true, runValidators: true });
                console.log("Your password has been successfully changed");
                return res.status(201).json({
                    message: "Your Password has been successfully changed",
                    updatedUser
                });
            }
            catch (err) {
                console.log(err);
                return res.status(201).json(err.message);
            }
        };
    }
}
exports.ResetPassword = ResetPassword;
