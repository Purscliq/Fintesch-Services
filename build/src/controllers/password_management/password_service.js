"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const forgot_password_1 = require("./forgotPassword/forgot_password");
const reset_password_1 = require("../../controllers/password_management/reset_password");
class PasswordService {
    constructor() {
        this.getResetOtp = (req, res) => this.forgotPassword.getResetOtp(req, res);
        // To be fixed
        this.resendResetOtp = (email) => this.forgotPassword.resendResetOtp(email);
        this.verifyResetOtp = (req, res) => this.forgotPassword.verifyResetOtp(req, res);
        this.editPassword = (req, res) => reset_password_1.ResetPassword.reset(req, res);
        this.forgotPassword = new forgot_password_1.ForgotPassword;
    }
}
exports.PasswordService = PasswordService;
