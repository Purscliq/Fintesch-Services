"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOTP = void 0;
class GenerateOTP {
    constructor() {
        this.instantiate = () => this.OTP;
        this.min = 100000;
        this.max = 999999;
        this.OTP = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }
}
exports.GenerateOTP = GenerateOTP;
