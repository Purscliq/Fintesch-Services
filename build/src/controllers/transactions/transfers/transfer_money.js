"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMoney = exports.accountNameValidation = exports.bankList = void 0;
// IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const Transaction_1 = require("../../../models/Transaction");
const Wallet_1 = require("../../../models/Wallet");
const decodeToken_1 = require("../../utils/decodeToken");
// import { generateRefID } from '../utils/generateRef';
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
};
// GET LISTS OF BANKS AND BANK CODE
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
// ACCOUNT NAME VALIDATION
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
        // validation payload
        const validationData = {
            bank_code: req.body.bankCode,
            account_number: req.body.accountNumber,
            currency: "NGN"
        };
        const response = await axios_1.default.post(url, validationData, { headers });
        const walletName = response.data.data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(walletName);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json("An unexpected error occurred");
    }
};
exports.accountNameValidation = accountNameValidation;
// SEND MONEY VIA TRANSFER
const sendMoney = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
    const { accountNumber, bankName, bankCode, amount, narration, PIN } = req.body;
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
        const wallet = await Wallet_1.Wallet.findOne({ user: userPayload.userId });
        if (!wallet)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("This account does not exist");
        // Verify that Transaction PIN is correct
        if (PIN !== wallet.PIN)
            throw ("Wrong PIN");
        // Check for sufficient balance to carry out Transcation
        if ((wallet.balance) < (parseInt(amount) + 20.00))
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("Insufficient Balance");
        // if there is sufficient amount, make api call to budpay
        const response = await axios_1.default.post(url, transferData, { headers });
        const info = response.data;
        if (!info) {
            throw ("Transaction failed");
        }
        // Save transaction details to Transaction collection
        const { data } = info;
        await Transaction_1.Transaction.create({
            user: userPayload.userId,
            ...data
        });
        // Deduct withdrawal amount from available balance and update wallet balance
        const balance = (wallet.balance) - parseInt(amount);
        wallet.balance = balance;
        await wallet.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json(info);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        console.error(error);
    }
};
exports.sendMoney = sendMoney;
