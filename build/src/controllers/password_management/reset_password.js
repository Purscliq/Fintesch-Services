"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
class ResetPassword {
    static async reset(req, res) {
        const { newPassword, confirmNewPassword } = req.body;
        try {
            const user = await User_1.User.findOne({ _id: req.params.id });
            if (!user)
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: "Bad Request: Request could not be completed"
                });
            if (newPassword !== confirmNewPassword)
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    error: "Passwords do not match"
                });
            const verifyPassword = await bcrypt_1.default.compare(newPassword, user.password);
            if (verifyPassword)
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json("You cannot use an old password");
            const securePass = await bcrypt_1.default.hash(newPassword, bcrypt_1.default.genSaltSync(10));
            const updatedPass = await User_1.User.findOneAndUpdate({ _id: req.params.id }, { password: securePass }, { new: true, runValidators: true });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Your Password has been successfully changed",
                updatedPass
            });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }
    ;
}
exports.ResetPassword = ResetPassword;
