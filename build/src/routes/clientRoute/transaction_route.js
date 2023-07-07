"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const card_fund_wallet_1 = require("../../controllers/transactions/cards/card_fund_wallet");
const one_time_payment_1 = require("../../controllers/transactions/transfers/one_time_payment");
const transfer_money_1 = require("../../controllers/transactions/transfers/transfer_money");
const fetchTransactionHistory_1 = require("../../controllers/admin/fetchTransactionHistory");
const transfer_money_2 = require("../../controllers/transactions/transfers/transfer_money");
const transfer_money_3 = require("../../controllers/transactions/transfers/transfer_money");
const router = express_1.default.Router();
router.route("/fund").post(card_fund_wallet_1.fundWallet);
router.route("/history").get(fetchTransactionHistory_1.fetchTransactionHistory);
router.route("/accept-money").post(one_time_payment_1.acceptMoney);
router.route("/transfer").get(transfer_money_3.bankList);
router.route("/transfer/validate").post(transfer_money_2.accountNameValidation);
router.route("/transfer/send").post(transfer_money_1.sendMoney);
module.exports = router;
