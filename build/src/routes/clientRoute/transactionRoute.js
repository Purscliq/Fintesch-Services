"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const fundMobileWallet_1 = require("../../controllers/transactions/fundMobileWallet");
const oneTimeTransfer_1 = require("../../controllers/transactions/oneTimeTransfer");
const router = express_1.default.Router();
router.route("/fund")
    .post(fundMobileWallet_1.fundWallet);
router.route("/accept-money")
    .post(oneTimeTransfer_1.acceptMoney);
module.exports = router;
