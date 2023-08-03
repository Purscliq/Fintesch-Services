"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickServicesRoute = void 0;
const express_1 = require("express");
const top_up_1 = require("../../controllers/transactions/quick-services/top-up");
class QuickServicesRoute {
    constructor() {
        this.instantiate = () => {
            this.router.route("/airtime").post(this.topup.airtime);
            this.router.route("/data").post(this.topup.data);
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.topup = new top_up_1.TopUpService();
        this.instantiate();
    }
    ;
}
exports.QuickServicesRoute = QuickServicesRoute;
;
