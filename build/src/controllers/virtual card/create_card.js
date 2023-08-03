"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const token_service_1 = require("../users/utils/token_service");
const Card_1 = require("../../models/Card");
const Wallet_1 = require("../../models/Wallet");
const KYC_1 = require("../../models/KYC");
(0, dotenv_1.config)();
class CardService {
    constructor() {
        this.createCardHolder = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = this.token.decode(authHeader.split(" ")[1]);
            const url = `${this.sudoBaseUrl}/customers`;
            try {
                const holder = await KYC_1.KYC.findOne({ user: userPayload.userId }).populate("user");
                if (!holder)
                    throw new Error('something went wrong');
                const fullname = holder.firstName + " " + holder.firstName + " " + holder.otherNames;
                const holderData = {
                    type: userPayload.role,
                    name: fullname,
                    individual: {
                        firstName: holder.firstName,
                        lastName: holder.firstName,
                        otherNames: holder.otherNames,
                        dob: holder.DOB,
                    },
                    status: holder.status,
                    billingAddress: {
                        line1: holder.address,
                        city: holder.city,
                        state: holder.state,
                        postalCode: holder.postalCode,
                        country: holder.country,
                    },
                    phoneNumber: holder.phoneNumber,
                    emailAddress: holder.user.email
                };
                const response = await axios_1.default.post(url, holderData, { headers: this.headers });
                const holderInfo = response.data.data;
                return holderInfo;
            }
            catch (err) {
                console.log(err);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("An expected error occurred");
            }
        };
        this.createCard = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = this.token.decode(authHeader.split(" ")[1]);
            const url = `${this.sudoBaseUrl}/cards`;
            const wallet = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("id status currency");
            if (!wallet)
                throw new Error('Something went wrong');
            const customer = await this.createCardHolder(req, res);
            try {
                const cardData = {
                    customerId: customer._id,
                    fundingSourceId: wallet.id,
                    type: "virtual",
                    currency: wallet.currency,
                    issuerCountry: "NGA",
                    status: wallet.status,
                    spendingControls: {
                        channels: {
                            atm: true,
                            pos: true,
                            web: true,
                            mobile: true
                        }
                    },
                    sendPINSMS: false,
                    brand: "Verve"
                };
                const response = await axios_1.default.post(url, cardData, { headers: this.headers });
                const data = response.data;
                console.log(data);
                if (!data || data.statusCode === 400) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: data.error,
                        message: data.message
                    });
                }
                const card = new Card_1.Card({});
                await card.save();
                return res.status(http_status_codes_1.StatusCodes.OK).json(card);
            }
            catch (err) {
                console.log(err.status, err.message);
                throw err;
            }
        };
        this.sudoKey = process.env.sudoKey;
        this.sudoBaseUrl = process.env.sudo_baseurl;
        this.token = new token_service_1.Token;
        this.headers = {
            authorization: `Bearer ${this.sudoKey}`,
            "content-type": "application/json",
            accept: 'application/json'
        };
    }
}
exports.CardService = CardService;
