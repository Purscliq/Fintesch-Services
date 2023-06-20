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
    PIN: {
        type: Number,
        required: true,
        unique: true,
        maximum: 4
    },
    accountName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: Number,
        unique: true,
        required: true
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
    status: {
        type: String,
        enum: { values: ['active', 'dormant', 'closed'], message: '{VALUE} is not supported' },
        default: 'active'
    },
    OTP: Number
}, { timestamps: true, strict: true });
exports.Account = (0, mongoose_1.model)("Account", accountSchema);
