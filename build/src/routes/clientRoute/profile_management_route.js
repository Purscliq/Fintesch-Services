"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const profile_1 = require("../../controllers/users/profile");
router.route("/")
    .get(profile_1.viewMyProfile)
    .patch(profile_1.editMyProfile)
    .delete(profile_1.deleteMyProfile);
module.exports = router;
