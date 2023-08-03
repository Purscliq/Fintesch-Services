"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Referral = void 0;
const mongoose_1 = require("mongoose");
const referralSchema = new mongoose_1.Schema({
    user_Id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    referral_Id: {
        type: String,
        required: true,
        unique: true
    },
    no_Of_Referrals: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Number,
        default: 0.00
    }
}, { timestamps: true });
exports.Referral = (0, mongoose_1.model)("referrals", referralSchema);
