"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMoney = exports.accountNameValidation = exports.bankList = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const Transaction_1 = require("../../models/Transaction");
const Account_1 = require("../../models/Account");
// import { generateRefID } from '../utils/generateRef'
const decodeToken_1 = require("../utils/decodeToken");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
};
// Get list of banks
const bankList = async (req, res) => {
    const bankListUrl = "https://api.budpay.com/api/v2/bank_list";
    // set header
    const header = {
        authorization: `Bearer ${budKey}`
    };
    // make api call to external service
    try {
        const response = await axios_1.default.get(bankListUrl, { headers: header });
        const bankList = response.data.data; // returns an array of objects
        return res.status(http_status_codes_1.StatusCodes.OK).json({ bankList });
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred with generating bank list");
    }
};
exports.bankList = bankList;
// Account Name validation
// @ Runs upon receiving bank name and account number input 
const accountNameValidation = async (req, res) => {
    const url = "https://api.budpay.com/api/v2/account_name_verify";
    // set header
    const headers = {
        authorization: `Bearer ${budKey}`,
        "content-type": "application/json"
    };
    // make api call to external service
    try {
        // validate parameters
        const validationData = {
            bank_code: req.body.bankCode,
            account_number: req.body.accountNumber,
            currency: "NGN"
        };
        const response = await axios_1.default.post(url, validationData, { headers });
        const accountName = response.data.data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(accountName);
    }
    catch (error) {
        console.error(error);
    }
};
exports.accountNameValidation = accountNameValidation;
// Send Money via transfer
const sendMoney = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
    const { accountNumber, bankName, bankCode, amount, narration } = req.body;
    const url = "https://api.budpay.com/api/v2/bank_transfer";
    try {
        // transfer parameters
        const transferData = {
            currency: "NGN",
            amount,
            bank_code: bankCode,
            bank_name: bankName,
            account_number: accountNumber,
            narration
        };
        // make api call to budpay
        const response = await axios_1.default.post(url, transferData, { headers });
        const info = response.data;
        console.log(info);
        if (!info) {
            throw ("Transfer not successful");
        }
        await Transaction_1.Transaction.create({
            user: userPayload.userId,
            ...(info.data)
        });
        const account = await Account_1.Account.findOne({ user: userPayload.userId });
        if (!account)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("This account does not exist");
        const balance = (account.balance) - parseInt(amount);
        if (balance < 0.00)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("Insufficient Balance");
        account.balance = balance;
        await account.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json(info);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        console.error(error);
    }
};
exports.sendMoney = sendMoney;
