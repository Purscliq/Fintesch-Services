"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordRoute = void 0;
const express_1 = require("express");
const forgot_password_1 = require("../controllers/password_management/forgotPassword/forgot_password");
const reset_password_1 = require("../controllers/password_management/forgotPassword/reset_password");
class ForgotPasswordRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.forgotPassword = new forgot_password_1.ForgotPassword;
        this.resetPassword = new reset_password_1.ResetPassword;
    }
    instantiate() {
        this.router.route("/").post(this.forgotPassword.getResetOtp)
            .get(this.forgotPassword.verifyResetOtp);
        this.router.route("/:id").post(this.resetPassword.reset);
        return this.router;
    }
}
exports.ForgotPasswordRoute = ForgotPasswordRoute;
