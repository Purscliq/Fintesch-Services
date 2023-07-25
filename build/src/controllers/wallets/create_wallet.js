"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const decode_token_1 = require("../utils/decode_token");
const KYC_1 = require("../../models/KYC");
const Wallet_1 = require("../../models/Wallet");
const verify_sms_1 = require("../utils/verify_sms");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json",
};
class WalletService {
    constructor() {
        // Create Customer method
        this.createCustomer = async (req, res) => {
            try {
                // Get user data from auth token
                const authHeader = req.headers.authorization;
                const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
                const url = "https://api.budpay.com/api/v2/customer";
                const kyc = await KYC_1.KYC.findOne({ user: userPayload.userId })
                    .select("firstName lastName phoneNumber status");
                // Check if KYC exists
                if (!kyc)
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send("KYC Not Found");
                // Check KYC status    
                if (!kyc.status)
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send("You are yet to be verified");
                // Create customer
                const customer = {
                    email: userPayload.email,
                    first_name: kyc.firstName,
                    last_name: kyc.lastName,
                    phone: kyc.phoneNumber,
                };
                const response = await axios_1.default.post(url, customer, { headers });
                const customerCode = response.data.data.customer_code;
                return customerCode;
            }
            catch (error) {
                console.log(error);
            }
        };
        // Create account
        this.createWallet = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
            const url = "https://api.budpay.com/api/v2/dedicated_virtual_account";
            await (0, verify_sms_1.verifySms)(req, res);
            const customerCode = await this.createCustomer(req, res);
            try {
                // make axios call to API to create account
                const response = await axios_1.default.post(url, { customer: customerCode }, { headers });
                const info = response.data;
                if (!info || info.status !== true) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: "Transaction Failed"
                    });
                }
                // account model payload
                const accountData = {
                    user: userPayload.userId,
                    id: info.data.id,
                    bank: info.data.bank,
                    account_name: info.data.account_name,
                    account_number: info.data.account_number,
                    currency: info.data.currency,
                    status: info.data.status,
                    reference: info.data.reference,
                    assignment: info.data.assignment,
                    customer: info.data.customer,
                    created_at: info.data.created_at,
                    updated_at: info.data.updated_at,
                    domain: info.data.domain,
                };
                // store account details to customer database
                const wallet = new Wallet_1.Wallet(accountData);
                await wallet.save();
                // return results
                return res.status(http_status_codes_1.StatusCodes.OK).json({});
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
            }
        };
    }
}
exports.WalletService = WalletService;
