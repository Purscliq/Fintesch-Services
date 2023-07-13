"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
// IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
(0, dotenv_1.config)();
const termiKey = process.env.termiKey;
const headers = {
    'Content-Type': 'application/json'
};
// Function to send OTP via SMS 
const sendSMS = async (phoneNumber, OTP) => {
    const termiiUrl = "https://api.ng.termii.com/api/sms/send";
    const smsData = {
        api_key: termiKey,
        to: phoneNumber,
        from: "e-Tranzact",
        sms: `Your e-tranzact OTP is ${OTP}. Password is valid for 10 minutes.`,
        type: "plain",
        channel: "generic"
    };
    try {
        const response = await axios_1.default.post(termiiUrl, smsData, { headers });
        const smsResponse = response.data;
        console.log(smsResponse);
        return smsResponse;
    }
    catch (err) {
        throw err;
    }
};
exports.sendSMS = sendSMS;
