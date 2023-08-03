"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardManagementRoute = void 0;
const express_1 = require("express");
class CardManagementRoute {
    constructor() {
        this.instantiate = () => {
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.instantiate();
    }
    ;
}
exports.CardManagementRoute = CardManagementRoute;
