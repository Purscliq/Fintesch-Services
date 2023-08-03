"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const forgot_password_1 = require("./forgot_password");
const change_passsword_1 = require("../change_passsword");
const reset_password_1 = require("./reset_password");
class PasswordService {
    constructor() {
        this.forgotPassword = new forgot_password_1.ForgotPassword;
        this.changePwd = new change_passsword_1.ChangePassword;
        this.reset = new reset_password_1.ResetPassword;
    }
    getResetOtp(req, res) {
        return this.forgotPassword.getResetOtp(req, res);
    }
    verifyResetOtp(req, res) {
        return this.forgotPassword.verifyResetOtp(req, res);
    }
    // To be fixed
    resendResetOtp(res, email) {
        return this.forgotPassword.resendResetOtp(res, email);
    }
    update(req, res) {
        return this.reset.reset(req, res);
    }
    changePassword(req, res) {
        return this.changePwd.update(req, res);
    }
}
exports.PasswordService = PasswordService;
