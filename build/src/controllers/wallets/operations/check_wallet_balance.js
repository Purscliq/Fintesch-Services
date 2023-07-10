"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletBalance = void 0;
const decode_token_1 = require("../../utils/decode_token");
const http_status_codes_1 = require("http-status-codes");
const Wallet_1 = require("../../../models/Wallet");
const getWalletBalance = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
    try {
        const walletBalance = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("balance");
        res.status(http_status_codes_1.StatusCodes.OK).json(walletBalance);
    }
    catch (err) {
        throw (err);
    }
};
exports.getWalletBalance = getWalletBalance;
