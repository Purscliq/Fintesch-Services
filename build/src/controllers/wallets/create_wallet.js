"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallets = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const token_service_1 = require("../users/utils/token_service");
const KYC_1 = require("../../models/KYC");
const Wallet_1 = require("../../models/Wallet");
;
(0, dotenv_1.config)();
class Wallets {
    constructor() {
        this.createCustomer = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = this.token.decode(authHeader.split(" ")[1]);
            const CustomerCreationEndPoint = `${this.budBaseUrl}/v2/customer`;
            try {
                const kyc = await KYC_1.KYC.findOne({ user: userPayload.userId }).select("firstName lastName phoneNumber status");
                if (!kyc)
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send("KYC Not Found");
                if (!kyc.status)
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send("You are yet to be verified");
                const customer = {
                    email: userPayload.email,
                    first_name: kyc.firstName,
                    last_name: kyc.lastName,
                    phone: kyc.phoneNumber,
                };
                const response = await axios_1.default.post(CustomerCreationEndPoint, customer, { headers: this.headers });
                const customerCode = response.data.data.customer_code;
                return customerCode;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        };
        this.createWallet = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = this.token.decode(authHeader.split(" ")[1]);
            const virtualAccountEndPoint = `${this.budBaseUrl}/v2/dedicated_virtual_account`;
            const customerCode = await this.createCustomer(req, res);
            try {
                const response = await axios_1.default.post(virtualAccountEndPoint, { customer: customerCode }, { headers: this.headers });
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
                return res.status(http_status_codes_1.StatusCodes.OK).json({});
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
            }
        };
        this.budBaseUrl = process.env.budBaseUrl;
        this.budKey = process.env.bud_key;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            'content-type': 'application/json'
        };
        this.token = new token_service_1.Token;
    }
}
exports.Wallets = Wallets;
