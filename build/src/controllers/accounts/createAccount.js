"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = exports.createCustomer = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const decodeToken_1 = require("../utils/decodeToken");
const KYC_1 = require("../../models/KYC");
const Account_1 = require("../../models/Account");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
};
// Create Customer and account
const createCustomer = async (req, res) => {
    try {
        // Get user data from auth token
        const authHeader = req.headers.authorization;
        const userPayload = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
        const url = "https://api.budpay.com/api/v2/customer";
        const kyc = await KYC_1.KYC.findOne({ user: userPayload.userId });
        if (!kyc)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("KYC Not Found");
        if (!kyc.status)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Yet to be verified");
        // Create customer
        const customer = {
            email: userPayload.email,
            first_name: kyc.firstName,
            last_name: kyc.lastName,
            phone: kyc.phoneNumber
        };
        const response = await axios_1.default.post(url, customer, { headers });
        const customerCode = response.data.data.customer_code;
        return customerCode;
    }
    catch (error) {
        console.log(error);
    }
};
exports.createCustomer = createCustomer;
// Create account
const createAccount = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
    const url = "https://api.budpay.com/api/v2/dedicated_virtual_account";
    const customerCode = await (0, exports.createCustomer)(req, res);
    try {
        // make axios call to API to create account
        // @params url, customer_code, headers
        const response = await axios_1.default.post(url, { customer: customerCode }, { headers });
        const info = response.data;
        // account model payload
        const accountData = {
            user: userPayload.userId,
            accountStatus: info.status,
            accountData: info.data
        };
        // store account details to customer database
        const account = new Account_1.Account(accountData);
        await account.save();
        // return results
        return res.status(http_status_codes_1.StatusCodes.OK).json(info);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
};
exports.createAccount = createAccount;
