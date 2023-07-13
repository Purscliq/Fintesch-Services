"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYC = void 0;
const mongoose_1 = require("mongoose");
const KYCSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    otherNames: {
        type: String,
        trim: true,
        default: ""
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    BVN: {
        type: String,
        unique: true,
        required: true
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    postalCode: {
        type: String
    },
    gender: {
        type: String
    },
    nationality: {
        type: String
    },
    idType: {
        type: String,
    },
    idNumber: {
        type: Number,
        // required: true,
        unique: true
    },
    expiryDate: {
        type: Date,
        // required: true
    },
    DOB: {
        type: String
    },
    OTP: {
        type: Number
    },
    status: {
        type: String,
        enum: {
            values: ["active", "inactive"],
            message: "{values} not supported"
        },
        default: 'inactive'
    },
}, { timestamps: true, strict: true });
exports.KYC = (0, mongoose_1.model)("KYC", KYCSchema);
