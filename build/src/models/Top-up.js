"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopUp = void 0;
const mongoose_1 = require("mongoose");
const TopUpSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    type: {
        type: String,
        enum: {
            values: ['airtime top up', 'data top up'],
            message: '{VALUE} is not supported'
        }
    },
    code: String,
    message: String,
    payment_data: {
        "network": String,
        "phone": String,
        "amount": String,
        "order_id": String,
        "data_plan": String
    }
}, { timestamps: true });
exports.TopUp = (0, mongoose_1.model)("TopUp", TopUpSchema);
