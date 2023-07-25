"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const check_wallet_balance_1 = require("../../controllers/wallets/operations/check_wallet_balance");
const set_wallet_PIN_1 = require("../../controllers/wallets/operations/set_wallet_PIN");
const create_wallet_1 = require("../../controllers/wallets/create_wallet");
// initialize the wallet class
const wallet = new create_wallet_1.WalletService();
// destructure the createWallet function out the instance of Wallets class
const { createWallet } = wallet;
const router = express_1.default.Router();
router.route("/").post(createWallet);
router.route("/balance").get(check_wallet_balance_1.getWalletBalance);
router.route("/pin").put(set_wallet_PIN_1.setTransactionPIN);
router.route("/change_pin").put(set_wallet_PIN_1.changeTransactionPIN);
module.exports = router;
