"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifySignupMail = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../../models/User");
class VerifySignupMail {
    static async verify(req, res) {
        const { OTP } = req.body;
        const user = await User_1.User.findOne({ OTP }).select("OTP");
        try {
            if (!user)
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: 'Please enter a valid one-time Password'
                });
            user.status = true;
            user.OTP = undefined;
            await user.save();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                Success: "You have been verified! Happy Tranzacting!",
                Status: user.verified
            });
        }
        catch (err) {
            console.log(err);
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                error: err.message
            });
        }
    }
}
exports.VerifySignupMail = VerifySignupMail;
