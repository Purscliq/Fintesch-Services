"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const createAccount_1 = require("../../controllers/accounts/createAccount");
const router = express_1.default.Router();
router.route("/create-account").post(createAccount_1.createAccount);
router.route("/create-customer").post(createAccount_1.createCustomer);
module.exports = router;
