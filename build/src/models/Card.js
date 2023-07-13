"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const mongoose_1 = require("mongoose");
const cardSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    wallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        unique: true,
        required: true
    },
    PIN: {
        type: Number,
        required: true,
        unique: true,
        maximum: 4
    },
    name: {
        type: String
    },
    cvv: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: { value: ["Verve", "MasterCard", "Visa"] },
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: { value: ["active", "expired", "blocked"] },
    },
    OTP: Number
}, { timestamps: true, strict: true });
exports.Card = (0, mongoose_1.model)("Card", cardSchema);
