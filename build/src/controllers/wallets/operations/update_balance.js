"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBalance = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const decode_token_1 = require("../../utils/decode_token");
const Transaction_1 = require("../../../models/Transaction");
const Wallet_1 = require("../../../models/Wallet");
const http_status_codes_1 = require("http-status-codes");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`
};
const updateBalance = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
    const { notify, notifyType, data } = req.body;
    const verifyUrl = `//api.budpay.com/api/v2/transaction/verify/:${data.reference}`;
    const payOutUrl = `https://budpay.com/api/v2/payout/:${data.reference}`;
    try {
        if (notify === "transaction" && notifyType === "successful") {
            const transactionData = {
                user: userPayload.userId,
                ...data
            };
            // verify transaction
            const response = await axios_1.default.get(verifyUrl, { headers });
            const result = response.data;
            // display result
            console.log(result);
            if (result.status !== true && data.currency !== result.data.currency) {
                throw ("Invalid transaction");
            }
            const wallet = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("balance");
            wallet.balance = (wallet.balance) + parseInt(result.data.amount);
            wallet.status = result.data.status;
            // Save transfer details to database
            const transaction = new Transaction_1.Transaction(transactionData);
            console.log(transaction);
            await transaction.save();
            // update wallet status with transaction status from webhook
            await wallet.save();
            return res.status(http_status_codes_1.StatusCodes.OK).json(wallet);
        }
        else if (notify === "payout" && notifyType === "successful") {
            // verify transaction
            const transaction = await Transaction_1.Transaction.findOne({ user: userPayload.userId });
            const response = await axios_1.default.get(payOutUrl, { headers });
            const result = response.data;
            console.log(result);
            if (result.status !== true && data.currency !== result.data.currency) {
                throw ("Invalid transaction");
            }
            transaction.status = result.data.status;
            console.log(transaction);
            // Save transfer details to database
            await transaction.save();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: `Transaction ${transaction.status}`
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.updateBalance = updateBalance;
// data.amount !== result.data.amount &&
