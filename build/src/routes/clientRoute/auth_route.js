"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const user_service_1 = require("../../controllers/users/user_service");
const verify_signup_mail_1 = require("../../controllers/users/utils/verify_signup_mail");
const authenticate_1 = require("../../../middlewares/authenticate");
class AuthRoutes {
    constructor() {
        this.instantiate = () => {
            this.router.route("/signup").post(this.user.signup);
            this.router.route("/verify").patch(verify_signup_mail_1.VerifySignupMail.verify);
            this.router.route("/signin").post(this.user.signin);
            this.router.route("/signout").post(authenticate_1.verifyToken, this.user.signout);
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.user = new user_service_1.Users;
        this.instantiate();
    }
    ;
}
exports.AuthRoutes = AuthRoutes;
