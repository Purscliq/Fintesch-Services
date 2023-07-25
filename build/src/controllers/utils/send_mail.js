"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const mailgun_js_1 = __importDefault(require("mailgun-js"));
// send Mail function
const sendMail = async (domain, key, messageData) => {
    const mailgun = new mailgun_js_1.default({
        apiKey: key,
        domain: domain
    });
    try {
        await mailgun.messages().send(messageData, (error, body) => {
            if (error)
                throw new Error(error);
            console.log(body);
        });
        console.log("Mail sent", messageData);
    }
    catch (error) {
        throw error;
    }
};
exports.sendMail = sendMail;
