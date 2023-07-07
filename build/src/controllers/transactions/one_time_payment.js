"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptMoney = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const generateRef_1 = require("../utils/generateRef");
const decodeToken_1 = require("../utils/decodeToken");
const KYC_1 = require("../../models/KYC");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
const acceptMoney = async (req, res) => {
    const authHeader = req.headers.authorization;
    const data = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
    const kyc = await KYC_1.KYC.findOne({ user: data.userId });
    const reference = (0, generateRef_1.generateRefID)();
    const url = "https://api.budpay.com/api/s2s/banktransfer/initialize";
    // set headers
    const headers = {
        authorization: `Bearer ${budKey}`,
        "content-type": "application/json"
    };
    try {
        if (!kyc)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Not Found");
        if (!kyc.status)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("KYC not complete");
        const name = kyc.firstName + " " + kyc.otherNames + " " + kyc.lastName;
        const { amount } = req.body;
        const paymentData = {
            email: data.email,
            amount,
            currency: "NGN",
            reference,
            name
        };
        const response = await axios_1.default.post(url, paymentData, { headers });
        const info = response.data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(info);
    }
    catch (error) {
        throw error;
    }
};
exports.acceptMoney = acceptMoney;
