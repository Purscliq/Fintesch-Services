"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCard = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const Card_1 = require("../../models/Card");
const token_service_1 = require("../users/utils/token_service");
(0, dotenv_1.config)();
class UpdateCard {
    constructor() {
        this.updateCardDetails = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = new token_service_1.Token().decode(authHeader.split(" ")[1]);
            const card = await Card_1.Card.findOne({ user: userPayload.userId }).select("id customer");
            const url = `${this.sudoBaseUrl}/cards:${card.id}`;
            try {
                const { status } = req.body;
                const data = {
                    status
                };
                const response = await axios_1.default.put(url, data, { headers: this.headers });
                const info = response.data;
                return res.status(http_status_codes_1.StatusCodes.OK).json(info);
            }
            catch (err) {
                throw (err);
            }
        };
        this.changeCardPin = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = new token_service_1.Token().decode(authHeader.split(" ")[1]);
            const card = await Card_1.Card.findOne({ user: userPayload.userId }).select("id customer");
            const url = `${this.sudoBaseUrl}/cards:${card.id}/pin`;
            try {
                const { oldPin, newPin } = req.body;
                const data = {
                    oldPin,
                    newPin
                };
                const response = await axios_1.default.put(url, data, { headers: this.headers });
                const info = response.data;
                return res.status(http_status_codes_1.StatusCodes.OK).json(info);
            }
            catch (err) {
                throw (err);
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
exports.UpdateCard = UpdateCard;
