"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "This field is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "invalid Email address"],
    },
    password: {
        type: String,
        required: [true, "This field is required"],
        trim: true,
        minlength: [6, "Minimum password character is 6"]
    },
    role: {
        type: String,
        enum: { values: ['individual', 'business', 'admin'], message: '{VALUE} is not supported' },
        default: 'individual'
    },
    OTP: Number,
    status: {
        type: Boolean,
        default: false
    },
}, { timestamps: true, strict: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
