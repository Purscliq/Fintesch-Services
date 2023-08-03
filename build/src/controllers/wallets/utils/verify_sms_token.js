"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifySmsToken = void 0;
const KYC_1 = require("../../../models/KYC");
const http_status_codes_1 = require("http-status-codes");
class VerifySmsToken {
}
exports.VerifySmsToken = VerifySmsToken;
_a = VerifySmsToken;
VerifySmsToken.verify = async (req, res) => {
    try {
        const { OTP } = req.body;
        const kyc = await KYC_1.KYC.findOne({ OTP }).select("OTP");
        if (!kyc)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: 'Please enter a valid one-time Password'
            });
        kyc.OTP = undefined;
        await kyc.save();
        return res.status(http_status_codes_1.StatusCodes.OK).redirect('/api/wallet');
    }
    catch (error) {
        console.error(error);
    }
};
