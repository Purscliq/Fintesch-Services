"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowYourCustomer = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const token_service_1 = require("../../users/utils/token_service");
const KYC_1 = require("../../../models/KYC");
const http_status_codes_1 = require("http-status-codes");
const send_sms_1 = require("../../utils/send_sms");
const generate_otp_1 = require("../../utils/generate_otp");
(0, dotenv_1.config)();
class KnowYourCustomer {
    constructor() {
        this.verifyBvn = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = this.token.decode(authHeader.split(" ")[1]);
            const { firstName, lastName, BVN, DOB, otherName, phoneNumber, address, state, city, country, postalCode, gender, nationality, idType, idNumber, expiryDate } = req.body;
            const verificationEndPoint = `${this.kycBaseUrl}/v1/verifications/identities/bvn/${BVN}`;
            const data = {
                firstname: firstName,
                lastname: lastName,
                othernames: otherName,
                dob: DOB
            };
            try {
                const response = await axios_1.default.post(verificationEndPoint, data, { headers: this.headers });
                const info = response.data.data;
                if (!info)
                    throw new Error("Bad Request");
                if ((info.firstname).toLowerCase() !== firstName.toLowerCase() ||
                    (info.lastname).toLowerCase() !== lastName.toLowerCase())
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        message: "KYC did not pass"
                    });
                const kycData = {
                    user: userPayload.userId,
                    firstName,
                    lastName,
                    BVN,
                    DOB,
                    otherName,
                    phoneNumber,
                    address,
                    state,
                    city,
                    country,
                    postalCode,
                    gender,
                    nationality,
                    idType,
                    idNumber,
                    expiryDate
                };
                const kyc = new KYC_1.KYC(kycData);
                kyc.status = "active";
                kyc.OTP = this.OTP;
                await kyc.save();
                const smsStatus = await new send_sms_1.SendSMS().sendOtp(info.phone, this.OTP);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    Success: http_status_codes_1.ReasonPhrases.OK,
                    message: "An OTP has been sent to your phone number",
                    smsStatus,
                    result: info
                });
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR });
            }
        };
        this.kycBaseUrl = process.env.verifyMeBaseUrl;
        this.liveKey = process.env.verifyMeKey;
        this.OTP = new generate_otp_1.GenerateOTP().instantiate();
        this.headers = {
            authorization: `Bearer ${this.liveKey}`,
            'content-type': 'application/json'
        };
        this.token = new token_service_1.Token;
    }
}
exports.KnowYourCustomer = KnowYourCustomer;
