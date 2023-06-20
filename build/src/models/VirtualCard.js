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
    accountID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Account",
        unique: true,
        required: true
    },
    PIN: {
        type: Number,
        required: true,
        unique: true,
        maximum: 4
    },
    cardName: {
        type: String,
        required: true,
        unique: true
    },
    cvv: {
        type: Number,
        required: true,
        unique: true
    },
    cardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    cardType: {
        type: String,
        required: true,
        enum: { value: ["Verve", "MasterCard", "Visa"] },
        default: "Verve"
    },
    OTP: Number,
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: { value: ["active", "expired", "blocked"] },
        default: "active"
    }
}, { timestamps: true, strict: true });
exports.Card = (0, mongoose_1.model)("Card", cardSchema);
