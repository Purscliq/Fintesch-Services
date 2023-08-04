"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const forgot_password_1 = require("./forgot_password");
const change_passsword_1 = require("../change_passsword");
const reset_password_1 = require("./reset_password");
class PasswordService {
    constructor() {
        this.getResetOtp = (req, res) => this.forgotPassword.getResetOtp(req, res);
        this.verifyResetOtp = (req, res) => this.forgotPassword.verifyResetOtp(req, res);
        // To be fixed
        this.resendResetOtp = (res, email) => this.forgotPassword.resendResetOtp(res, email);
        this.update = (req, res) => reset_password_1.ResetPassword.reset(req, res);
        this.changePassword = (req, res) => this.changePwd.update(req, res);
        this.forgotPassword = new forgot_password_1.ForgotPassword;
        this.changePwd = new change_passsword_1.ChangePassword;
    }
}
exports.PasswordService = PasswordService;
