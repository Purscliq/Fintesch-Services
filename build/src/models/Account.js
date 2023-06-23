"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const mongoose_1 = require("mongoose");
const accountSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    accountStatus: {
        type: Boolean,
    },
    accountData: {
        type: Object
    },
    balance: {
        type: Number,
        required: true,
        default: 0.00
    },
    currency: {
        type: String,
        required: true,
        default: "NGN"
    },
    PIN: {
        type: Number,
        unique: true,
        maximum: 4
    },
});
exports.Account = (0, mongoose_1.model)("Account", accountSchema);
