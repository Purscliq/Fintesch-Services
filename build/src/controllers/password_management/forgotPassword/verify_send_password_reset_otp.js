"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyResetEmailAndSendOtp = void 0;
const dotenv_1 = require("dotenv");
const generate_otp_1 = require("../../utils/generate_otp");
const User_1 = require("../../../models/User");
const send_mail_1 = require("../../utils/send_mail");
(0, dotenv_1.config)();
class VerifyResetEmailAndSendOtp {
    constructor() {
        this.verifyAndSend = async (email) => {
            const user = await User_1.User.findOne({ email });
            try {
                if (!user)
                    throw new Error("Error occured: Could not send OTP");
                user.OTP = this.OTP;
                await user.save();
                const messageData = {
                    from: 'e-Tranzact<jon@gmail.com>',
                    to: email,
                    subject: 'PASSWORD RESET',
                    html: this.mailText
                };
                send_mail_1.SendMail.send(this.domain, this.key, messageData);
            }
            catch (error) {
                console.error(error);
            }
        };
        this.domain = process.env.DOMAIN;
        this.key = process.env.api_key;
        this.OTP = new generate_otp_1.GenerateOTP;
        this.mailText = `<h3> You requested to reset your password. Here's your One-time Password: 
        ${this.OTP}. If this isn't you, kindly ignore this mail./p>`;
    }
}
exports.VerifyResetEmailAndSendOtp = VerifyResetEmailAndSendOtp;
