"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVerified = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../src/models/User");
const decode_token_1 = require("../src/controllers/utils/decode_token");
async function isVerified(req, res, next) {
    try {
        const decoded = (0, decode_token_1.decodeToken)(req.cookies.jwt);
        const user = await User_1.User.findOne({ _id: decoded.userId }).select("isVerified");
        // Check if the user is verified
        // If the user is verified, allow them to proceed to the next middleware function
        if (user.isVerified) {
            next();
        }
        else {
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: "You are not verified yet"
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.json({
            error: error.status,
            message: error.message
        });
    }
}
exports.isVerified = isVerified;
