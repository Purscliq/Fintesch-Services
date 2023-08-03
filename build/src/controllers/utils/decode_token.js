"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodeToken = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)();
class DecodeToken {
    constructor() {
        this.secret = process.env.secretKey;
    }
    decode(token) {
        try {
            if (!this.secret)
                throw new Error("Cannot access secret Key");
            const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
            if (!decodedToken) {
                throw new Error("Token could not be decoded.");
            }
            return decodedToken;
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.DecodeToken = DecodeToken;
