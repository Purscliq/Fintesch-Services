"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Referral = void 0;
const mongoose_1 = require("mongoose");
const referralSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    referralID: {
        type: String,
        required: true,
        unique: true
    },
    noOfReferrals: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Number,
        default: 0.00
    }
}, { timestamps: true });
exports.Referral = (0, mongoose_1.model)("referrals", referralSchema);
