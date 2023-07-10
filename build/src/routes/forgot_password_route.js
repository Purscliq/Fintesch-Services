"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const password_reset_1 = require("../controllers/password/password_reset");
const router = express_1.default.Router();
const reset = new password_reset_1.ResetPassword();
const { forgotPassword, verifyOTP, resetPassword } = reset;
// /pwd/reset = /
router.route("/")
    .post(forgotPassword)
    .get(verifyOTP)
    .patch(resetPassword);
module.exports = router;
