"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayBill = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const token_service_1 = require("../../users/utils/token_service");
const http_status_codes_1 = require("http-status-codes");
const Pay_bills_1 = require("../../../models/Pay-bills");
const KYC_1 = require("../../../models/KYC");
(0, dotenv_1.config)();
class PayBill {
    constructor() {
        this.electricity = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = new token_service_1.Token().decode(authHeader.split(" ")[1]);
            const phonenumber = await KYC_1.KYC.findOne({ user: userPayload.userId }).select("phoneNumber");
            const { meter_number, provider, variation_id, amount } = req.body;
            const url = `${this.vtuBaseUrl}/electricity?username=${this.username}&password=${this.password}&phone=${phonenumber.phoneNumber}&meter_number=${meter_number}&service_id=${provider}&variation_id=${variation_id}&amount=${amount}`;
            try {
                const response = await axios_1.default.get(url);
                const data = response.data;
                console.log(data);
                const billpaymentRecord = new Pay_bills_1.Bills({
                    user: userPayload.userId,
                    type: "Electricity",
                    code: data.code,
                    message: data.message,
                    payment_data: data.data
                });
                await billpaymentRecord.save();
                return res.status(http_status_codes_1.StatusCodes.OK).json(data);
            }
            catch (err) {
                console.error(err.message);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
            }
        };
        this.cableTv = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = new token_service_1.Token().decode(authHeader.split(" ")[1]);
            const phonenumber = await KYC_1.KYC.findOne({ user: userPayload.userId }).select("phoneNumber");
            const { smartcard_number, provider, variation_id } = req.body;
            const url = `${this.vtuBaseUrl}/tv?username=${this.username}&password=${this.password}&phone=${phonenumber.phoneNumber}&service_id=${provider}&smartcard_number=${smartcard_number}&variation_id=${variation_id}`;
            try {
                const response = await axios_1.default.get(url);
                const data = response.data;
                console.log(data);
                const billpaymentRecord = new Pay_bills_1.Bills({
                    user: userPayload.userId,
                    type: "Cable-tv",
                    code: data.code,
                    message: data.message,
                    payment_data: data.data
                });
                await billpaymentRecord.save();
                return res.status(http_status_codes_1.StatusCodes.OK).json(data);
            }
            catch (err) {
                console.error(err.message);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
            }
        };
        this.username = process.env.vtu_username;
        this.password = process.env.vtu_password;
        this.vtuBaseUrl = process.env.vtu_baseUrl;
    }
    ;
}
exports.PayBill = PayBill;
;
// @josh_dev30
//     const data = {
//         code:"success",
//         message:"Electricity bill successfully paid",
//         data: {
//             electricity: "Ikeja (IKEDC)",
//             meter_number: "62418234034",
//             token: "Token: 5345 8765 3456 3456 1232",
//             units: "47.79kwH","phone":"07045461790",
//             amount: "NGN3000",
//             amount_charged: "NGN2970",
//             order_id:"4324"
//         }
//     }
//     const datas = {
//         "code":"success",
//         "message":"Cable TV subscription successfully delivered",
//         "data": {
//             "cable_tv":"GOtv",
//             "subscription_plan": "GOtv Max",
//             "smartcard_number": "7032400086",
//             "phone":"07045461790",
//             "amount":"NGN3280",
//             "amount_charged": "NGN3247.2",
//             "service_fee": "NGN0.00",
//             "order_id": "2876"
//     }
// }
