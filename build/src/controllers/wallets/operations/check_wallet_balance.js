"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletBalance = void 0;
const decodeToken_1 = require("../../utils/decodeToken");
const http_status_codes_1 = require("http-status-codes");
const Wallet_1 = require("../../../models/Wallet");
const getWalletBalance = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
    try {
        const walletBalance = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("balance");
        res.status(http_status_codes_1.StatusCodes.OK).json(walletBalance);
    }
    catch (err) {
        throw (err);
    }
};
exports.getWalletBalance = getWalletBalance;
