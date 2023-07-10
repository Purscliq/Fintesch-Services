"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTransactionPIN = exports.setTransactionPIN = void 0;
const decode_token_1 = require("../../utils/decode_token");
const Wallet_1 = require("../../../models/Wallet");
const http_status_codes_1 = require("http-status-codes");
const setTransactionPIN = async (req, res) => {
    try {
        const { PIN } = req.body;
        const authHeader = req.headers.authorization;
        const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
        // save PIN to database
        const wallet = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("PIN");
        if (!wallet)
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .send("Your account could not be retrieved");
        wallet.PIN = Number(PIN);
        await wallet.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            Success: "PIN has been successfully set",
            PIN: wallet.PIN,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.setTransactionPIN = setTransactionPIN;
const changeTransactionPIN = async (req, res) => {
    try {
        const { newPIN } = req.body;
        const authHeader = req.headers.authorization;
        const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
        // save PIN to database
        const wallet = await Wallet_1.Wallet.findOneAndUpdate({ user: userPayload.userId }, { PIN: Number(newPIN) }, {
            new: true,
            runValidators: true,
        }).select("PIN");
        if (!wallet)
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .send("Your account could not be retrieved");
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            Success: "PIN has been successfully set",
            PIN: wallet.PIN,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.changeTransactionPIN = changeTransactionPIN;
