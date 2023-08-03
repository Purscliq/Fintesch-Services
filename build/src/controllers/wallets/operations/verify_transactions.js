"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTransactions = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
// import { decodeToken } from "../../utils/decode_token";
// import { JwtPayload } from "jsonwebtoken";
// import { Request, Response } from "express";
(0, dotenv_1.config)();
class VerifyTransactions {
    constructor() {
        this.budKey = process.env.bud_key;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
    }
    async verify(url, data) {
        try {
            const response = await axios_1.default.get(url, { headers: this.headers });
            if (!response)
                throw 'null value was returned';
            const result = response.data;
            if (result.status !== true &&
                data.currency !== result.data.currency)
                throw "Invalid transaction";
            return result;
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.VerifyTransactions = VerifyTransactions;
