"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = void 0;
const decode_token_1 = require("./decode_token");
const generate_otp_1 = require("./generate_otp");
const User_1 = require("../../models/User");
const http_status_codes_1 = require("http-status-codes");
const send_mail_1 = require("./send_mail");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const domain = process.env.DOMAIN;
const key = process.env.api_key;
const resendOTP = async (req, res) => {
    try {
        const data = (0, decode_token_1.decodeToken)(req.cookies.jwt);
        const user = await User_1.User.findOne({ email: data.email });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: http_status_codes_1.ReasonPhrases.NOT_FOUND });
        }
        user.OTP = (0, generate_otp_1.generateOTP)();
        await user.save();
        // resend OTP to user Mail
        const mailText = `<p> Your One-Time password for your e-Tranzact account is ${user.OTP}.
        Password expires in 10 minutes</p>`;
        const messageData = {
            from: 'e-Tranzact <jon@gmail.com>',
            to: data.email,
            subject: 'One-Time Password',
            html: mailText
        };
        await (0, send_mail_1.sendMail)(domain, key, messageData);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "A One-Time password has been sent to your mail",
            newCode: user.OTP
        });
    }
    catch (err) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
};
exports.resendOTP = resendOTP;
