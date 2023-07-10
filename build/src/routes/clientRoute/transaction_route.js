"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const card_fund_wallet_1 = require("../../controllers/transactions/cards/card_fund_wallet");
const one_time_payment_1 = require("../../controllers/transactions/transfers/one_time_payment");
const transfer_money_1 = require("../../controllers/transactions/transfers/transfer_money");
const fetch_transaction_history_1 = require("../../controllers/admin/fetch_transaction_history");
const transfer_money_2 = require("../../controllers/transactions/transfers/transfer_money");
const transfer_money_3 = require("../../controllers/transactions/transfers/transfer_money");
const router = express_1.default.Router();
router.route("/fund").post(card_fund_wallet_1.fundWallet);
router.route("/accept-money").post(one_time_payment_1.acceptMoney);
router.route("/transfer").get(transfer_money_3.bankList);
router.route("/transfer/validate").post(transfer_money_2.accountNameValidation);
router.route("/transfer/send").post(transfer_money_1.sendMoney);
router.route("/history").get(fetch_transaction_history_1.fetchTransactionHistory);
module.exports = router;
