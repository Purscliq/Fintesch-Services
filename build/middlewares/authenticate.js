"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const secretKey = process.env.secretKey;
(0, dotenv_1.config)();
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        if (!secretKey)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("Provide secret authentication key.");
        if (!token)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("Authentication token not detected");
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        if (!decodedToken)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("Token verification failed!");
        return next();
    }
    catch (err) {
        throw Error("An unexpected error occured with token verification");
    }
};
exports.verifyToken = verifyToken;
