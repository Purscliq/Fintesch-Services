"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyKycOTP = void 0;
const http_status_codes_1 = require("http-status-codes");
const KYC_1 = require("../../models/KYC");
// verify OTP
const verifyKycOTP = async (req, res) => {
    try {
        const { OTP } = req.body;
        const kyc = await KYC_1.KYC.findOne({ OTP }).select("OTP");
        if (!kyc) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: 'Please enter a valid one-time Password' });
        }
        kyc.status = true;
        kyc.OTP = undefined;
        await kyc.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({ Success: "You have been verified! An account will be created!", Status: kyc.verified });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
};
exports.verifyKycOTP = verifyKycOTP;
