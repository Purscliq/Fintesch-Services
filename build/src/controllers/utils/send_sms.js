"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.sendSMS = exports.getSenderId = void 0;
// IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
(0, dotenv_1.config)();
const termiKey = process.env.termiKey;
const headers = {
    'Content-Type': ['application/json', 'application/json']
};
const getSenderId = async () => {
    const url = `https://api.ng.termii.com/api/sender-id?api_key=${termiKey}`;
    const response = await axios_1.default.get(url, { headers });
    const result = response.data;
    const senderID = result.data[0].sender_id;
    console.log(senderID);
    return senderID;
};
exports.getSenderId = getSenderId;
// Function to send OTP via SMS 
const sendSMS = async (req, res, phoneNumber, OTP) => {
    const termiiUrl = "https://api.ng.termii.com/api/sms/send";
    const senderID = await (0, exports.getSenderId)();
    const smsData = {
        api_key: termiKey,
        to: phoneNumber,
        from: senderID,
        sms: `Your e-tranzact OTP is ${OTP}. Password is valid for 10 minutes.`,
        type: "plain",
        channel: "generic"
    };
    try {
        const response = await axios_1.default.post(termiiUrl, smsData, { headers });
        if (!response)
            throw Error;
        const smsResponse = response.data;
        console.log(smsResponse);
        return smsResponse;
    }
    catch (err) {
        throw err;
    }
};
exports.sendSMS = sendSMS;
const run = async (req, res) => {
    const sms = await (0, exports.sendSMS)(req, res, "2347026238705", 123456);
    console.log(sms);
};
exports.run = run;
