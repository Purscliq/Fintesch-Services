"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = void 0;
const decodeToken_1 = require("./decodeToken");
const generateOTP_1 = require("./generateOTP");
const User_1 = require("../../models/User");
const http_status_codes_1 = require("http-status-codes");
const sendMail_1 = require("./sendMail");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const domain = process.env.DOMAIN;
const key = process.env.api_key;
const resendOTP = async (req, res) => {
    try {
        const data = (0, decodeToken_1.decodeToken)(req.cookies.jwt);
        const user = await User_1.User.findOne({ email: data.email });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: http_status_codes_1.ReasonPhrases.NOT_FOUND });
        }
        user.OTP = (0, generateOTP_1.generateOTP)();
        await user.save();
        // resend OTP to user Mail
        const mailText = `<p>Your One-Time password for your e-Tranzact account is ${user.OTP}.
        Password expires in 10 minutes</p>`;
        const messageData = {
            from: 'e-Tranzact <jon@gmail.com>',
            to: data.email,
            subject: 'One-Time Password',
            html: mailText
        };
        (0, sendMail_1.sendMail)(domain, key, messageData);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "A One-Time password has been sent to your mail", newCode: user.OTP });
    }
    catch (err) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
};
exports.resendOTP = resendOTP;
