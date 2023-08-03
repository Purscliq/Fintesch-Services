"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagementRoute = void 0;
const express_1 = require("express");
class UserManagementRoute {
    constructor() {
        this.instantiate = () => {
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.instantiate();
    }
    ;
}
exports.UserManagementRoute = UserManagementRoute;
