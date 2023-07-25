"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const card_fund_wallet_1 = require("../../controllers/transactions/cards/card_fund_wallet");
const transfer_money_1 = require("../../controllers/transactions/transfers/transfer_money");
const fundWallet = new card_fund_wallet_1.FundWalletService();
const sendMoney = new transfer_money_1.SendMoneyService();
// import { acceptMoney } from '../../controllers/transactions/transfers/one_time_payment'
// import { fetchTransactionHistory } from '../../controllers/admin/fetch_transaction_history'
const router = express_1.default.Router();
router.route("/fund").post(fundWallet.fund);
router.route("/transfer").get(sendMoney.getBankList);
router.route("/transfer/validate").post(sendMoney.accountNameValidation);
router.route("/transfer/send").post(sendMoney.send);
module.exports = router;
