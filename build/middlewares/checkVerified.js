"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVerified = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../src/models/User");
const decodeToken_1 = require("../src/controllers/utils/decodeToken");
async function isVerified(req, res, next) {
    try {
        const decoded = (0, decodeToken_1.decodeToken)(req.cookies.jwt);
        const user = await User_1.User.findOne({ _id: decoded.userId });
        // Check if the user is verified
        // If the user is verified, allow them to proceed to the next middleware function
        if (user.isVerified) {
            next();
        }
        else {
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: "You are not verified yet" });
        }
    }
    catch (error) {
        console.error(error);
        return res.send(error);
    }
}
exports.isVerified = isVerified;
