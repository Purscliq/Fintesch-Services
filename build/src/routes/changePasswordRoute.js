"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const passwordReset_1 = require("../controllers/password/passwordReset");
const router = express_1.default.Router();
const reset = new passwordReset_1.ResetPassword();
const { resetPassword } = reset;
// /api/pwd/reset = /
router.route("/")
    .patch(resetPassword);
module.exports = router;
