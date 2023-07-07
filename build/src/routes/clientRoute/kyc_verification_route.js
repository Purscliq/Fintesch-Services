"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const kyc_1 = require("../../controllers/wallets/kyc");
const set_wallet_PIN_1 = require("../../controllers/wallets/operations/set_wallet_PIN");
router.route("/").post(kyc_1.bvnVerification);
router.route("/set-pin").patch(set_wallet_PIN_1.setTransactionPIN);
module.exports = router;
