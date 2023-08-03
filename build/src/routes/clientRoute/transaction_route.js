"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsRoute = void 0;
const express_1 = require("express");
const card_fund_wallet_1 = require("../../controllers/transactions/cards/card_fund_wallet");
const send_money_1 = require("../../controllers/transactions/transfers/send_money");
class TransactionsRoute {
    constructor() {
        this.instantiate = () => {
            this.router.route("/fund").post(this.fund.fundWallet);
            this.router.route("/transfer").get(this.send.getBankList);
            this.router.route("/transfer/validate").post(this.send.accountNameValidation);
            this.router.route("/transfer/send").post(this.send.sendMoney);
            return this.router;
        };
        this.router = (0, express_1.Router)();
        this.fund = new card_fund_wallet_1.FundWalletService;
        this.send = new send_money_1.SendMoneyService;
        this.instantiate();
    }
}
exports.TransactionsRoute = TransactionsRoute;
