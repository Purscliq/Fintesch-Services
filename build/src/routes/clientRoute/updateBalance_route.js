"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceUpdateRoute = void 0;
const express_1 = require("express");
class BalanceUpdateRoute {
    constructor() {
        this.instantiate = () => {
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.instantiate();
    }
    ;
}
exports.BalanceUpdateRoute = BalanceUpdateRoute;
