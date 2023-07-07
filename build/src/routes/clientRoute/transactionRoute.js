"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const fundWallet_1 = require("../../controllers/transactions/fundWallet");
const acceptOneTimePayment_1 = require("../../controllers/transactions/acceptOneTimePayment");
const transferMoney_1 = require("../../controllers/transactions/transferMoney");
const fetchTransactionHistory_1 = require("../../controllers/admin/fetchTransactionHistory");
const transferMoney_2 = require("../../controllers/transactions/transferMoney");
const transferMoney_3 = require("../../controllers/transactions/transferMoney");
const router = express_1.default.Router();
router.route("/fund").post(fundWallet_1.fundWallet);
router.route("/history").get(fetchTransactionHistory_1.fetchTransactionHistory);
router.route("/accept-money").post(acceptOneTimePayment_1.acceptMoney);
router.route("/transfer").post(transferMoney_3.bankList);
router.route("/transfer/send").post(transferMoney_1.sendMoney);
router.route("/transfer/validate").post(transferMoney_2.accountNameValidation);
module.exports = router;
