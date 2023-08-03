"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycRoute = void 0;
const express_1 = require("express");
const kyc_1 = require("../../controllers/wallets/utils/kyc");
class KycRoute {
    constructor() {
        this.instantiate = () => {
            this.router.route("/").post(this.kyc.verifyBvn);
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.kyc = new kyc_1.KnowYourCustomer;
        this.instantiate();
    }
}
exports.KycRoute = KycRoute;
