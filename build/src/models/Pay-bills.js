"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bills = void 0;
const mongoose_1 = require("mongoose");
const BillSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    type: {
        type: String,
        enum: {
            values: ['Electricity', 'Cable-tv'],
            message: '{VALUE} is not supported'
        }
    },
    code: String,
    message: String,
    payment_data: {
        meter_number: String,
        electricity: String,
        token: String,
        units: String,
        amount: String,
        amount_charged: String,
        order_id: String
    },
}, { timestamps: true });
exports.Bills = (0, mongoose_1.model)("PayBills", BillSchema);
