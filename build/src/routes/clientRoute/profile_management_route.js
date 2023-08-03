"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileManagementRoute = void 0;
const express_1 = require("express");
const user_service_1 = require("../../controllers/users/user_service");
class ProfileManagementRoute {
    constructor() {
        this.instantiate = () => {
            this.router.route("/")
                .get(this.user.viewProfile)
                .patch(this.user.updateProfile)
                .delete(this.user.deleteProfile);
            return this.router;
        };
        this.user = new user_service_1.Users;
        this.router = (0, express_1.Router)();
        this.instantiate();
    }
}
exports.ProfileManagementRoute = ProfileManagementRoute;
