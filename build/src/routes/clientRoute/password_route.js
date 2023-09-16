"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordRoute = void 0;
const express_1 = require("express");
// import { ForgotPassword } from '../../controllers/password_management/forgotPassword/forgot_password';
// import { ResetPassword } from '../../controllers/password_management/reset_password';
const password_service_1 = require("../../controllers/password_management/password_service");
const authenticate_1 = require("../../../middlewares/authenticate");
class PasswordRoute {
    constructor() {
        this.instantiate = () => {
            this.router.route("/").post(this.password.getResetOtp)
                .get(this.password.verifyResetOtp)
                .put(this.password.resendResetOtp);
            this.router.route("/:id").patch(this.password.editPassword)
                .put(authenticate_1.verifyToken, this.password.editPassword);
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.password = new password_service_1.PasswordService;
        this.instantiate();
    }
}
exports.PasswordRoute = PasswordRoute;
