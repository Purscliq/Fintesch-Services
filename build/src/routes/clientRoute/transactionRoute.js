"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const fundMobileWallet_1 = require("../../controllers/transactions/fundMobileWallet");
const oneTimeTransfer_1 = require("../../controllers/transactions/oneTimeTransfer");
const transferMoney_1 = require("../../controllers/transactions/transferMoney");
const fetchTransactionHistory_1 = require("../../controllers/transactions/fetchTransactionHistory");
const router = express_1.default.Router();
router.route("/fund").post(fundMobileWallet_1.fundWallet);
router.route("/accept-money").post(oneTimeTransfer_1.acceptMoney);
router.route("/send-money").post(transferMoney_1.sendMoney);
router.route("/history").get(fetchTransactionHistory_1.fetchTransactionHistory);
module.exports = router;
