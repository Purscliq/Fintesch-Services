"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
(0, dotenv_1.config)();
const verifyToken = async (req, res, next) => {
    const secret = process.env.secretKey;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        if (!secret)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json("Provide secret authentication key.");
        if (!token)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json("Authentication token not detected");
        const decodedToken = jsonwebtoken_1.default.verify(token, secret);
        if (!decodedToken)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json("Token verification failed!");
        return next();
    }
    catch (err) {
        console.error(err);
    }
};
exports.verifyToken = verifyToken;
