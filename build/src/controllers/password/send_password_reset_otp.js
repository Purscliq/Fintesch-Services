"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetEmailAndSendOTP = void 0;
// IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const generate_otp_1 = require("../utils/generate_otp");
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../models/User");
const send_mail_1 = require("../utils/send_mail");
(0, dotenv_1.config)();
// Mailgun message data parameters
const domain = process.env.DOMAIN;
const key = process.env.api_key;
// @ Send email
// This function verifies the user's email, creates a reset token and sends an email containing reset link
const verifyResetEmailAndSendOTP = async (req, res, email) => {
    try {
        const user = await User_1.User.findOne({ email });
        if (!user) {
            console.log("USER NOT FOUND");
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("USER NOT FOUND");
        }
        user.OTP = (0, generate_otp_1.generateOTP)();
        await user.save();
        const messageData = {
            from: 'e-Tranzact<jon@gmail.com>',
            to: email,
            subject: 'PASSWORD RESET',
            html: `<h3> You requested to reset your password. Here's your One-Time Password: 
             ${user.OTP}. If this isn't you, kindly ignore this mail./p>`
        };
        (0, send_mail_1.sendMail)(domain, key, messageData);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("Error occured: Could not send OTP");
    }
};
exports.verifyResetEmailAndSendOTP = verifyResetEmailAndSendOTP;
