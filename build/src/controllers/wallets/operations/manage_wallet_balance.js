"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Balance = void 0;
const token_service_1 = require("../../users/utils/token_service");
const http_status_codes_1 = require("http-status-codes");
const Wallet_1 = require("../../../models/Wallet");
const Transaction_1 = require("../../../models/Transaction");
const verify_transactions_1 = require("./verify_transactions");
class Balance {
    constructor() {
        this.budBaseUrl = process.env.budBaseUrl;
        this.token = new token_service_1.Token;
    }
    async getWalletBalance(req, res) {
        const authHeader = req.headers.authorization;
        const userPayload = this.token.decode(authHeader.split(" ")[1]);
        try {
            const walletBalance = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("balance");
            if (!walletBalance)
                throw 'Null value returned';
            return res.status(http_status_codes_1.StatusCodes.OK).json(walletBalance);
        }
        catch (err) {
            console.error(err);
        }
    }
    async updateBalance(req, res) {
        const authHeader = req.headers.authorization;
        const userPayload = this.token.decode(authHeader.split(" ")[1]);
        const { notify, notifyType, data } = req.body;
        try {
            if (notify === "transaction" &&
                notifyType === "successful" &&
                data.type === "dedicated_nuban") {
                const url = `${this.budBaseUrl}/v2/transaction/verify/:${data.reference}`;
                const verifyPayin = await new verify_transactions_1.VerifyTransactions().verify(url, data);
                const wallet = await Wallet_1.Wallet.findOne({
                    user: userPayload.userId
                }).select("balance");
                wallet.balance = (wallet.balance) + parseInt(verifyPayin.data.amount);
                wallet.status = verifyPayin.data.status;
                await wallet.save();
                const webhookData = {
                    user: userPayload.userId,
                    ...data
                };
                const transaction = new Transaction_1.Transaction(webhookData);
                await transaction.save();
            }
            else if (notify === "payout" && notifyType === "successful") {
                const url = `${this.budBaseUrl}/v2/payout/verify/:${data.reference}`;
                const transaction = await Transaction_1.Transaction.findOne({ user: userPayload.userId });
                const verifyPayout = await new verify_transactions_1.VerifyTransactions().verify(url, data);
                transaction.status = verifyPayout.data.status;
                await transaction.save();
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: `Transaction ${transaction.status}`
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.Balance = Balance;
// data.amount !== result.data.amount &&
