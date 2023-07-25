"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../controllers/users/auth");
const verify_otp_1 = require("../../controllers/utils/verify_otp");
const resend_otp_1 = require("../../controllers/utils/resend_otp");
const router = express_1.default.Router();
const auth = new auth_1.AuthService();
const { signup, signin } = auth;
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/resendOTP").patch(resend_otp_1.resendOTP);
router.route("/verify").patch(verify_otp_1.verifyOTP);
module.exports = router;
