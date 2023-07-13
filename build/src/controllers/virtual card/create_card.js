"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCard = void 0;
// IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const decode_token_1 = require("../utils/decode_token");
const Card_1 = require("../../models/Card");
const Wallet_1 = require("../../models/Wallet");
const create_cardholder_1 = require("./create_cardholder");
(0, dotenv_1.config)();
const sudoKey = process.env.sudoKey;
const headers = {
    authorization: `Bearer ${sudoKey}`,
    "content-type": "application/json",
    accept: 'application/json'
};
// CREATE CARD FUNCTION
const createCard = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
    const url = 'https://api.sandbox.sudo.cards/cards';
    const wallet = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("id status currency");
    if (!wallet)
        throw Error;
    // creates a card customer 
    const customer = await (0, create_cardholder_1.createCardHolder)(req, res);
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
        const response = await axios_1.default.post(url, cardData, { headers });
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
        res.status(http_status_codes_1.StatusCodes.OK).json(card);
    }
    catch (err) {
        console.log(err.status, err.message);
        throw err;
    }
};
exports.createCard = createCard;
