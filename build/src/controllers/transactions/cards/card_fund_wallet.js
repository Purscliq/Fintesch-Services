"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundWalletService = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const generate_ref_1 = require("../../utils/generate_ref");
const decode_token_1 = require("../../utils/decode_token");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
};
class FundWalletService {
    constructor() {
        this.encryptCard = async (req, res) => {
            const reference = (0, generate_ref_1.generateRefID)();
            const url = "https://api.budpay.com/api/s2s/test/encryption";
            try {
                // get card details
                const { amount, number, expiryMonth, expiryYear, cvv, pin } = req.body;
                const cardData = {
                    data: { number, expiryMonth, expiryYear, cvv },
                    reference
                };
                // Make axios API call to encrypt card
                const response = await axios_1.default.post(url, cardData, { headers });
                const encryptedCard = response.data;
                return {
                    encryptedCard,
                    pin,
                    amount,
                    reference
                };
            }
            catch (error) {
                throw error;
            }
        };
        // ENCRYPT CARD
        this.fund = async (req, res) => {
            const authHeader = req.headers.authorization;
            const data = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
            const payUrl = "https://api.budpay.com/api/s2s/transaction/initialize";
            const cardObj = await this.encryptCard(req, res);
            try {
                // Initialize Wallet Funding
                const paymentData = {
                    amount: cardObj.amount,
                    card: cardObj.encryptedCard,
                    callback: "www.budpay.com",
                    currency: "NGN",
                    email: data.email,
                    pin: cardObj.pin,
                    reference: cardObj.reference
                };
                const response = await axios_1.default.post(payUrl, paymentData, { headers });
                const info = response.data;
                console.log(info);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ info });
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
                console.error(error);
            }
        };
    }
}
exports.FundWalletService = FundWalletService;
