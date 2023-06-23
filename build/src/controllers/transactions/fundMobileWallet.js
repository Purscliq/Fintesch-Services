"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundWallet = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const generateRef_1 = require("../utils/generateRef");
const decodeToken_1 = require("../utils/decodeToken");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
};
// ENCRYPT CARD
const fundWallet = async (req, res) => {
    const authHeader = req.headers.authorization;
    const data = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
    const reference = (0, generateRef_1.generateRefID)();
    const url = "https://api.budpay.com/api/s2s/test/encryption";
    const payUrl = "https://api.budpay.com/api/s2s/transaction/initialize";
    try {
        // get card details
        const { amount, number, expiryMonth, expiryYear, cvv, pin } = req.body;
        const budData = {
            data: { number, expiryMonth, expiryYear, cvv },
            reference
        };
        // Make axios API call to encrypt card
        const response = await axios_1.default.post(url, budData, { headers });
        const encryptedCard = response.data;
        console.log(encryptedCard);
        // Initialize Wallet Funding
        const paymentData = {
            amount,
            card: encryptedCard,
            callback: "www.budpay.com",
            currency: "NGN",
            email: data.email,
            pin,
            reference
        };
        const resp = await axios_1.default.post(payUrl, paymentData, { headers });
        const resInfo = resp.data;
        console.log(resInfo);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ resInfo });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
        console.error(error);
    }
};
exports.fundWallet = fundWallet;
