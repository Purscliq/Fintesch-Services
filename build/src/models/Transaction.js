"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    id: Number,
    reference: { type: String, unique: true },
    sessionid: String,
    currency: { type: String, default: "NGN" },
    amount: String,
    fee: String,
    // receiver detail
    bankCode: String,
    bankName: String,
    accountNumber: String,
    accountName: String,
    narration: String,
    status: { type: String, default: "pending" }
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
