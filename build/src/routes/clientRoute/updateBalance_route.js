"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const updateBalance_1 = require("../../controllers/wallets/operations/updateBalance");
router.route("/")
    .patch(updateBalance_1.updateBalance);
module.exports = router;
