"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const update_balance_1 = require("../../controllers/wallets/operations/update_balance");
router.route("/")
    .patch(update_balance_1.updateBalance);
module.exports = router;
