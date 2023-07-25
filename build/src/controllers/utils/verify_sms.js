"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySms = void 0;
const KYC_1 = require("../../models/KYC");
const http_status_codes_1 = require("http-status-codes");
const verifySms = async (req, res) => {
    try {
        const { OTP } = req.body;
        const kyc = await KYC_1.KYC.findOne({ OTP }).select("OTP");
        if (!kyc) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: 'Please enter a valid one-time Password'
            });
        }
        kyc.OTP = undefined;
        await kyc.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            Success: "Verification was successful"
        });
    }
    catch (error) {
        throw error;
    }
};
exports.verifySms = verifySms;
