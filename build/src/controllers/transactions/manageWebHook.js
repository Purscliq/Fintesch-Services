"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionWebHook = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const decodeToken_1 = require("../utils/decodeToken");
const Transaction_1 = require("../../models/Transaction");
const Account_1 = require("../../models/Account");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`
};
const transactionWebHook = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
    const { notify, notifyType, data } = req.body;
    const verifyUrl = `//api.budpay.com/api/v2/transaction/verify/:${data.reference}`;
    try {
        if (notify === "transaction" && notifyType === "successful") {
            const transactionData = {
                user: userPayload.userId,
                ...data
            };
            // Save transfer details to database
            const transaction = new Transaction_1.Transaction(transactionData);
            await transaction.save();
            // verify transaction
            const response = await axios_1.default.get(verifyUrl, { headers });
            const verifiedTransaction = response.data;
            console.log(verifiedTransaction);
            if (verifiedTransaction.message !== "message successful")
                throw ("Transaction Failed");
            const account = await Account_1.Account.findOne({ user: userPayload.userId });
            account.balance = (account.balance) + parseInt(verifiedTransaction.data.amount);
            account.status = verifiedTransaction.data.status;
            await account.save();
        }
        else if (notify === "payout" && notifyType === "successful") {
            const transaction = await Transaction_1.Transaction.findOne({ user: userPayload.userId });
            const response = await axios_1.default.get(verifyUrl, { headers });
            const verifiedTransaction = response.data;
            console.log(verifiedTransaction);
            if (verifiedTransaction.message !== "message successful")
                throw ("Transaction Failed");
            if (verifiedTransaction.data.status === "failed")
                transaction.status = verifiedTransaction.data.status;
            await transaction.save();
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.transactionWebHook = transactionWebHook;
