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
const token_service_1 = require("../../users/utils/token_service");
(0, dotenv_1.config)();
// returns an error from budpay at the moment
class FundWalletService {
    constructor() {
        this.encryptCard = async (req, res) => {
            const url = `${this.budBaseUrl}/s2s/test/encryption`;
            try {
                const { amount, number, expiryMonth, expiryYear, cvv, pin } = req.body;
                const cardData = {
                    data: {
                        number,
                        expiryMonth,
                        expiryYear,
                        cvv
                    },
                    reference: this.reference
                };
                const response = await axios_1.default.post(url, cardData, { headers: this.headers });
                const encryptedCard = response.data;
                res.status(http_status_codes_1.StatusCodes.OK).json(encryptedCard);
                return {
                    encryptedCard,
                    pin,
                    amount,
                    reference: this.reference
                };
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
            }
        };
        this.fundWallet = async (req, res) => {
            const authHeader = req.headers.authorization;
            const data = this.token.decode(authHeader.split(" ")[1]);
            const payEndPoint = `${this.budBaseUrl}/s2s/transaction/initialize`;
            const cardObj = await this.encryptCard(req, res);
            try {
                const paymentPayload = {
                    amount: cardObj.amount,
                    card: cardObj.encryptedCard,
                    callback: "www.budpay.com",
                    currency: "NGN",
                    email: data.email,
                    pin: cardObj.pin,
                    reference: cardObj.reference
                };
                const response = await axios_1.default.post(payEndPoint, paymentPayload, { headers: this.headers });
                const info = response.data;
                return res.status(http_status_codes_1.StatusCodes.OK).json({ info });
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
            }
        };
        this.reference = new generate_ref_1.RefGenerator().instantiate();
        this.budBaseUrl = process.env.budBaseUrl;
        this.budKey = process.env.bud_key;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
        this.token = new token_service_1.Token;
    }
}
exports.FundWalletService = FundWalletService;
