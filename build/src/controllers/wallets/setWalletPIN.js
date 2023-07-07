"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTransactionPIN = void 0;
const decodeToken_1 = require("../utils/decodeToken");
const Account_1 = require("../../models/Account");
const http_status_codes_1 = require("http-status-codes");
const setTransactionPIN = async (req, res) => {
    try {
        const { PIN } = req.body;
        const authHeader = req.headers.authorization;
        const userPayload = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
        // save PIN to database
        const account = await Account_1.Account.findOne({ user: userPayload.userId }).select("PIN");
        if (!account)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Your account could not be retrieved");
        account.PIN = PIN;
        await account.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            Success: "PIN has been successfully set"
        });
    }
    catch (error) {
        throw error;
    }
};
exports.setTransactionPIN = setTransactionPIN;
