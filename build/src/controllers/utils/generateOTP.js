"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
function generateOTP() {
    const min = 100000; // Minimum value (inclusive)
    const max = 999999; // Maximum value (inclusive)
    const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    return OTP;
}
exports.generateOTP = generateOTP;
