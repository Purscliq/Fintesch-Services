"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckStatus = void 0;
const http_status_codes_1 = require("http-status-codes");
const token_service_1 = require("../src/controllers/users/utils/token_service");
class CheckStatus {
    static isVerified(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const user = new token_service_1.Token().decode(authHeader.split(" ")[1]);
            (user.status) ? next() : res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: "You are not verified yet"
            });
        }
        catch (error) {
            console.error(error);
            return res.status(error.status).json({
                error: error.status,
                message: error.message
            });
        }
    }
}
exports.CheckStatus = CheckStatus;
