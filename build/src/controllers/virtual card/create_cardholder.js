"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCardHolder = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const decode_token_1 = require("../utils/decode_token");
const KYC_1 = require("../../models/KYC");
(0, dotenv_1.config)();
const sudoKey = process.env.sudoKey;
const headers = {
    authorization: `Bearer ${sudoKey}`,
    "content-type": "application/json",
    accept: 'application/json'
};
const createCardHolder = async (req, res) => {
    const authHeader = req.headers.authorization;
    const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
    const url = 'https://api.sandbox.sudo.cards/customers';
    try {
        const holder = await KYC_1.KYC.findOne({ user: userPayload.userId }).populate("user");
        if (!holder)
            throw ("Holder is null");
        const fullname = holder.firstName + " " + holder.firstName + " " + holder.otherNames;
        // card holder data
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
        const response = await axios_1.default.post(url, holderData, { headers });
        // Response Information
        const holderInfo = response.data.data;
        console.log(response.data);
        return holderInfo;
    }
    catch (err) {
        console.log(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("An expected error occurred");
    }
};
exports.createCardHolder = createCardHolder;
