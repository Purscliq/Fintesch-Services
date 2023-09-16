"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = void 0;
const dotenv_1 = require("dotenv");
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../../models/User");
const verify_send_password_reset_otp_1 = require("./verify_send_password_reset_otp");
(0, dotenv_1.config)();
class ForgotPassword {
    constructor() {
        this.getResetOtp = async (req, res) => {
            try {
                const { email } = req.body;
                await new verify_send_password_reset_otp_1.VerifyResetEmailAndSendOtp().verifyAndSend(email);
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(error.message);
            }
        };
        //  Incomplete.
        this.resendResetOtp = async (email) => {
            try {
                await new verify_send_password_reset_otp_1.VerifyResetEmailAndSendOtp().verifyAndSend(email);
            }
            catch (error) {
                console.error(error);
                throw (error.message);
            }
        };
        this.verifyResetOtp = async (req, res) => {
            const { OTP } = req.body;
            const user = await User_1.User.findOne({ OTP }).select('OTP');
            try {
                if (!OTP || OTP !== user.OTP)
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: "A valid One-time password is needed"
                    });
                return res.status(http_status_codes_1.StatusCodes.OK).redirect(http_status_codes_1.StatusCodes.PERMANENT_REDIRECT, `/password/reset/${user._id}`);
            }
            catch (error) {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
            }
        };
    }
}
exports.ForgotPassword = ForgotPassword;
