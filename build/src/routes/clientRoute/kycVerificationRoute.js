"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bvnVerification_1 = require("../../controllers/accounts/bvnVerification");
router.route("/")
    .post(bvnVerification_1.bvnVerification);
module.exports = router;