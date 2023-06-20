"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    refID: {
        type: mongoose_1.Schema.Types.ObjectId,
        unique: true,
        required: true
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Bank: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    fee: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: {
            values: ["withdrawal, deposit, transfer"]
        }
    },
    status: {
        type: String,
        enum: {
            values: ["Pending, Success, Failed"]
        },
        default: "Pending"
    }
}, { timestamps: true, strict: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
