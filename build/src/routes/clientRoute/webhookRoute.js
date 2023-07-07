"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const manageWebHook_1 = require("../../controllers/transactions/manageWebHook");
router.route("/webhook")
    .post(manageWebHook_1.transactionWebHook);
module.exports = router;
