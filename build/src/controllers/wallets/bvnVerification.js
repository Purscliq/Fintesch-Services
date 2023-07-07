"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bvnVerification = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const decodeToken_1 = require("../utils/decodeToken");
const KYC_1 = require("../../models/KYC");
const http_status_codes_1 = require("http-status-codes");
(0, dotenv_1.config)();
const liveKey = process.env.verifyMe_key;
// const testKey = process.env.testKey as string
// Verify user via BVN
const bvnVerification = async (req, res) => {
    // Get user token from auth header
    const authHeader = req.headers.authorization;
    const userPayload = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
    // Get KYC details
    const { firstName, lastName, BVN, DOB, otherName, phoneNumber, address, gender, nationality, idType, idNumber, expiryDate } = req.body;
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
            gender,
            nationality,
            idType,
            idNumber,
            expiryDate,
        };
        const kyc = new KYC_1.KYC(kycData);
        kyc.status = "active";
        await kyc.save();
        // SEND OTP TO PHONE NUMBER (Phone Number verification)
        // return result
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            Success: http_status_codes_1.ReasonPhrases.OK,
            message: "An OTP has been sent to your Phone number",
            result: info
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
};
exports.bvnVerification = bvnVerification;
