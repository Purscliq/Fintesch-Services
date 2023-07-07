"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const createWallet_1 = require("../../controllers/wallets/createWallet");
const checkWalletBalance_1 = require("../../controllers/wallets/checkWalletBalance");
const router = express_1.default.Router();
// router.route("/create-customer").post(createCustomer)
router.route("/create-account").post(createWallet_1.createAccount);
router.route("/balance").post(checkWalletBalance_1.getWalletBalance);
module.exports = router;
