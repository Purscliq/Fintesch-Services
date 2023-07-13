"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCardPin = exports.updateCardDetails = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
(0, dotenv_1.config)();
const sudoKey = process.env.sudoKey;
const headers = {
    authorization: `Bearer ${sudoKey}`,
    "content-type": "application/json",
    accept: 'application/json'
};
const updateCardDetails = async (req, res) => {
    // const authHeader = req.headers.authorization as string;
    // const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
    const url = 'https://api.sandbox.sudo.cards/cards/:id';
    // const card = await Card.findOne({user: userPayload.userId}).select("id customer");
    try {
        const { status } = req.body;
        const data = {
            status
        };
        const response = await axios_1.default.put(url, data, { headers });
        const info = response.data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(info);
    }
    catch (err) {
        throw (err);
    }
};
exports.updateCardDetails = updateCardDetails;
const changeCardPin = async (req, res) => {
    // const authHeader = req.headers.authorization as string;
    // const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
    const url = 'https://api.sandbox.sudo.cards/cards/:{id}/pin';
    // const card = await Card.findOne({user: userPayload.userId}).select("id customer");
    try {
        const { oldPin, newPin } = req.body;
        const data = {
            oldPin,
            newPin
        };
        const response = await axios_1.default.put(url, data, { headers });
        const info = response.data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(info);
    }
    catch (err) {
        throw (err);
    }
};
exports.changeCardPin = changeCardPin;
