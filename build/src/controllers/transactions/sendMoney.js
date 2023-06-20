"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMoney = exports.bankList = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
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
    const header = {
        authorization: `Bearer ${budKey}`
    };
    const response = await axios_1.default.get(bankListUrl, { headers: header });
    const bankList = response.data.data; // returns an array of objects
    res.status(http_status_codes_1.StatusCodes.OK).json({ bankList });
    return bankList;
};
exports.bankList = bankList;
// Send Money via transfer
const sendMoney = async (req, res) => {
    const { accountNumber, bankName, amount, narration } = req.body;
    const url = "https://api.budpay.com/api/v2/bank_transfer";
    const bank_list = await (0, exports.bankList)(req, res);
    try {
        const bank = bank_list.find((bankObj) => bankObj.bank_name === bankName);
        const bankCode = bank.bank_code;
        const transferData = {
            currency: "NGN",
            amount,
            bank_code: bankCode,
            bank_name: bankName,
            account_number: accountNumber,
            narration
        };
        const response = await axios_1.default.post(url, transferData, { headers });
        const info = response.data;
        console.log(info);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        console.error(error);
    }
};
exports.sendMoney = sendMoney;
