"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckRole = void 0;
const http_status_codes_1 = require("http-status-codes");
const token_service_1 = require("../src/controllers/users/utils/token_service");
class CheckRole {
    constructor(role) {
        this.role = role;
    }
    check(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const user = new token_service_1.Token().decode(authHeader.split(" ")[1]);
            (user.role === this.role) ? next() : res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: `${(this.role).toUpperCase} ONLY! You are not authorized to perform this action.`
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
exports.CheckRole = CheckRole;
