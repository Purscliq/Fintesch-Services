"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePassword = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../models/User");
class ChangePassword {
    async update(req, res) {
        try {
            const newPassword = await User_1.User.findOneAndUpdate({
                _id: req.params.id
            }, req.body, {
                new: true,
                runValidators: true
            });
            if (!newPassword)
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ Error: "Invalid Request" });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: 'Successful',
                data: newPassword
            });
        }
        catch (e) {
            console.error(e);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: e.message });
        }
    }
}
exports.ChangePassword = ChangePassword;
