"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../src/models/User");
const decodeToken_1 = require("../src/controllers/utils/decodeToken");
async function isAdmin(req, res, next) {
    const decoded = (0, decodeToken_1.decodeToken)(req.cookies.jwt);
    const user = await User_1.User.findOne({ _id: decoded.userId });
    // Check if the user making the request is an admin
    // If the user is an admin, allow them to proceed to the next middleware function
    if (user.role === "Admin") {
        next();
    }
    else {
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: "ONLY ADMIN! You are not authorized to perform this action" });
    }
}
exports.isAdmin = isAdmin;
