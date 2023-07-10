"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    id: Number,
    reference: { type: String, unique: true },
    sessionid: String,
    currency: String,
    amount: String,
    fee: String,
    type: String,
    bank_code: String,
    bank_name: String,
    account_number: String,
    account_name: String,
    settled_by: String,
    subaccount: String,
    narration: String,
    status: String,
    channel: String,
    customer: Object,
    message: String,
    metadata: String,
    settlement_batchid: String,
    plan: String,
    card_attempt: Number,
    requested_amount: String,
    ip_address: String,
    paid_at: Date,
    created_at: Date,
    updated_at: Date
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
