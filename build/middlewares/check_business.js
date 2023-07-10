"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBusiness = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../src/models/User");
const decode_token_1 = require("../src/controllers/utils/decode_token");
async function isBusiness(req, res, next) {
    try {
        const decoded = (0, decode_token_1.decodeToken)(req.cookies.jwt);
        const user = await User_1.User.findOne({ _id: decoded.userId }).select("role");
        // Check if the user making the request is an business
        // If the user is an admin, allow them to proceed to the next middleware function
        if (user.role === "Business") {
            next();
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: "ONLY BUSINESSES! You are not authorized to perform this action"
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
exports.isBusiness = isBusiness;
