"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendSMS = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
(0, dotenv_1.config)();
class SendSMS {
    constructor() {
        this.headers = {
            'Content-Type': ['application/json', 'application/json']
        };
        this.getSenderId = async () => {
            const url = `${this.termiBaseUrl}/sender-id?api_key=${this.termiKey}`;
            const response = await axios_1.default.get(url, { headers: this.headers });
            const result = response.data;
            const senderID = result.data[0].sender_id;
            return senderID;
        };
        this.sendOtp = async (phoneNumber, OTP) => {
            const termiiUrl = `${this.termiBaseUrl}/sms/send`;
            const senderID = await new SendSMS().getSenderId();
            const smsData = {
                api_key: this.termiKey,
                to: phoneNumber,
                from: senderID,
                sms: `Your e-tranzact OTP is ${OTP}. Password is valid for 10 minutes.`,
                type: "plain",
                channel: "generic"
            };
            try {
                const response = await axios_1.default.post(termiiUrl, smsData, { headers: this.headers });
                if (!response)
                    throw new Error;
                const smsResponse = response.data;
                return smsResponse;
            }
            catch (err) {
                console.error(err);
            }
        };
        this.termiKey = process.env.termiKey;
        this.termiBaseUrl = process.env.termi_baseUrl;
    }
    ;
}
exports.SendSMS = SendSMS;
