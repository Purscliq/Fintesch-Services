"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMail = void 0;
const mailgun_js_1 = __importDefault(require("mailgun-js"));
class SendMail {
    static async send(domain, key, messageData) {
        const mailgun = new mailgun_js_1.default({
            apiKey: key,
            domain: domain
        });
        try {
            await mailgun.messages().send(messageData, (error, body) => {
                if (error)
                    throw new Error(error.message);
                console.log(body);
            });
            console.log("Mail sent", messageData);
        }
        catch (error) {
            console.error(error.message);
        }
    }
}
exports.SendMail = SendMail;
