"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bvnVerification = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const decode_token_1 = require("../utils/decode_token");
const KYC_1 = require("../../models/KYC");
const http_status_codes_1 = require("http-status-codes");
const send_sms_1 = require("../utils/send_sms");
const generate_otp_1 = require("../utils/generate_otp");
(0, dotenv_1.config)();
const liveKey = process.env.verifyMeKey;
// Verify user via BVN
const bvnVerification = async (req, res) => {
    // Get user token from auth header
    const authHeader = req.headers.authorization;
    const userPayload = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
    // Get KYC details
    const { firstName, lastName, BVN, DOB, otherName, phoneNumber, address, state, city, country, postalCode, gender, nationality, idType, idNumber, expiryDate } = req.body;
    // PERFORM KYC
    try {
        const url = `https://vapi.verifyme.ng/v1/verifications/identities/bvn/${BVN}`;
        const headers = {
            authorization: `Bearer ${liveKey}`,
            'Content-Type': 'application/json'
        };
        const data = {
            firstname: firstName,
            lastname: lastName,
            othernames: otherName,
            dob: DOB
        };
        const response = await axios_1.default.post(url, data, { headers });
        const info = response.data.data;
        if (!info) {
            throw Error;
        }
        if ((info.firstname).toLowerCase() !== firstName.toLowerCase() || (info.lastname).toLowerCase() !== lastName.toLowerCase())
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "KYC did not pass" });
        // Save KYC details to DB
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
        // SEND OTP TO PHONE NUMBER (Phone Number verification)
        const OTP = (0, generate_otp_1.generateOTP)();
        const smsStatus = await (0, send_sms_1.sendSMS)(req, res, info.phone, OTP);
        console.log(smsStatus);
        kyc.status = "active";
        kyc.OTP = OTP;
        // const expiryTime = Date.now() + 600000
        // setTimeout(() => {
        //     kyc.OTP = undefined;
        // }, expiryTime)
        await kyc.save();
        // return result
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            Success: http_status_codes_1.ReasonPhrases.OK,
            message: "An OTP has been sent to your phone number",
            smsStatus,
            result: info
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
};
exports.bvnVerification = bvnVerification;
