"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// IMPORT ROUTER
const express_1 = __importDefault(require("express"));
const profile_1 = require("../../controllers/users/profile");
const users = new profile_1.UserService();
const { viewProfile, editProfile, deleteProfile, signOut } = users;
const router = express_1.default.Router();
router.route("/")
    .get(viewProfile)
    .patch(editProfile)
    .delete(deleteProfile);
router.route("/signout").post(signOut);
module.exports = router;
