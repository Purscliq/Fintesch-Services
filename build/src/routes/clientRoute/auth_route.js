"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../../controllers/users/auth");
const verifyOTP_1 = require("../../controllers/utils/verifyOTP");
const resendOTP_1 = require("../../controllers/utils/resendOTP");
const authenticate = new auth_1.Authenticate();
const { signUp, signIn } = authenticate;
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/resendOTP").patch(resendOTP_1.resendOTP);
router.route("/verify").patch(verifyOTP_1.verifyOTP);
module.exports = router;
