"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionPin = void 0;
const token_service_1 = require("../../users/utils/token_service");
const Wallet_1 = require("../../../models/Wallet");
const http_status_codes_1 = require("http-status-codes");
class TransactionPin {
    constructor() {
        this.token = new token_service_1.Token;
    }
    async setPin(req, res) {
        const { PIN } = req.body;
        const authHeader = req.headers.authorization;
        const userPayload = this.token.decode(authHeader.split(" ")[1]);
        try {
            const wallet = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("PIN");
            if (!wallet)
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Bad Request: account could not be retrieved" });
            wallet.PIN = Number(PIN);
            await wallet.save();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                Success: "PIN has been successfully set",
                PIN: wallet.PIN,
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    ;
    async changePin(req, res) {
        try {
            const { newPIN } = req.body;
            const authHeader = req.headers.authorization;
            const userPayload = this.token.decode(authHeader.split(" ")[1]);
            const wallet = await Wallet_1.Wallet.findOneAndUpdate({ user: userPayload.userId }, { PIN: Number(newPIN) }, {
                new: true,
                runValidators: true,
            }).select("PIN");
            if (!wallet)
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Bad Request: account could not be retrieved" });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                Success: "PIN has been successfully changed",
                PIN: wallet.PIN,
            });
        }
        catch (error) {
            throw error;
        }
    }
    ;
}
exports.TransactionPin = TransactionPin;
