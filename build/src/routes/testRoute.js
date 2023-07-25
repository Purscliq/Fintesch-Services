"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const send_sms_1 = require("../controllers/utils/send_sms");
const router = express_1.default.Router();
router.route("/").get(send_sms_1.getSenderId);
router.route("/").post(send_sms_1.run);
module.exports = router;
