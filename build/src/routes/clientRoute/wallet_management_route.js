"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const create_wallet_1 = require("../../controllers/wallets/create_wallet");
const check_wallet_balance_1 = require("../../controllers/wallets/operations/check_wallet_balance");
const set_wallet_PIN_1 = require("../../controllers/wallets/operations/set_wallet_PIN");
const router = express_1.default.Router();
// router.route("/create-customer").post(createCustomer)
router.route("/create-account").post(create_wallet_1.createAccount);
router.route("/balance").get(check_wallet_balance_1.getWalletBalance);
router.route("/pin").patch(set_wallet_PIN_1.setTransactionPIN);
router.route("/change_pin").patch(set_wallet_PIN_1.changeTransactionPIN);
module.exports = router;
