"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const wallet_service_1 = require("../../controllers/wallets/wallet_service");
const verify_sms_token_1 = require("../../controllers/wallets/utils/verify_sms_token");
class WalletRoutes {
    constructor() {
        this.instantiate = () => {
            this.router.route("/").patch(verify_sms_token_1.VerifySmsToken.verify);
            this.router.route("/").post(this.wallet.createWallet);
            this.router.route("/balance").get(this.wallet.checkBalance);
            this.router.route("/pin").put(this.wallet.setPin);
            this.router.route("/change_pin").put(this.wallet.changePin);
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.wallet = new wallet_service_1.WalletService;
        this.instantiate();
    }
    ;
}
exports.WalletRoutes = WalletRoutes;
;
