"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordRoute = void 0;
const express_1 = require("express");
const change_passsword_1 = require("../controllers/password_management/change_passsword");
class UpdatePasswordRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.changePassword = new change_passsword_1.ChangePassword;
    }
    instantiate() {
        this.router.route("/:id").post(this.changePassword.update);
        return this.router;
    }
}
exports.UpdatePasswordRoute = UpdatePasswordRoute;
