"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneTimePayment = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const generate_ref_1 = require("../../utils/generate_ref");
const token_service_1 = require("../../users/utils/token_service");
const KYC_1 = require("../../../models/KYC");
(0, dotenv_1.config)();
class OneTimePayment {
    constructor() {
        // not tested
        this.acceptMoney = async (req, res) => {
            const authHeader = req.headers.authorization;
            const data = this.token.decode(authHeader.split(" ")[1]);
            const kyc = await KYC_1.KYC.findOne({ user: data.userId });
            const url = `${this.budBaseUrl}/s2s/banktransfer/initialize`;
            try {
                if (!kyc)
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json("Request could not be completed");
                if (!kyc.status)
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json("KYC not complete");
                const name = kyc.firstName + " " + kyc.otherNames + " " + kyc.lastName;
                const { amount } = req.body;
                const paymentData = {
                    email: data.email,
                    amount,
                    currency: "NGN",
                    reference: this.reference,
                    name
                };
                const response = await axios_1.default.post(url, paymentData, { headers: this.headers });
                const info = response.data;
                return res.status(http_status_codes_1.StatusCodes.OK).json(info);
            }
            catch (error) {
                throw error;
            }
        };
        this.budKey = process.env.bud_key;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
        this.budBaseUrl = process.env.budBaseUrl;
        this.reference = new generate_ref_1.RefGenerator().instantiate();
        this.token = new token_service_1.Token;
    }
}
exports.OneTimePayment = OneTimePayment;
