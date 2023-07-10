"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTransactionHistory = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
const fetchTransactionHistory = async (req, res) => {
    const historyUrl = "https://api.budpay.com/api/v2/wallet_transactions/NGN";
    const header = {
        authorization: `Bearer ${budKey}`
    };
    try {
        const response = await axios_1.default.get(historyUrl, { headers: header });
        const transactionHistory = response.data.data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(transactionHistory);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        console.error(error);
    }
};
exports.fetchTransactionHistory = fetchTransactionHistory;
