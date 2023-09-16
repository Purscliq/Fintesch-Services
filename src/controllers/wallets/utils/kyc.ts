import {config} from 'dotenv';
import { Request, Response } from "express";
import axios from 'axios';
import { Token } from '../../users/utils/token_service';
import { KYC } from "../../../models/KYC";
import { JwtPayload } from "jsonwebtoken";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { SendSMS } from '../../utils/send_sms';
import { GenerateOTP } from '../../utils/generate_otp';

config();

export class KnowYourCustomer {
    private kycBaseUrl: string;
    private liveKey: string;
    private headers;
    private OTP: number;
    private token: Token;

    constructor() {
        this.kycBaseUrl = process.env.verifyMeBaseUrl as string;
        this.liveKey = process.env.verifyMeKey as string;
        this.OTP = new GenerateOTP().instantiate();
        this.headers = {
            authorization: `Bearer ${this.liveKey}`,
            'content-type': 'application/json'
        };
        this.token = new Token;
    }

    public verifyBvn = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

        const { 
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
        } = req.body;

        const verificationEndPoint = `${this.kycBaseUrl}/v1/verifications/identities/bvn/${BVN}`

        const data = {
            firstname: firstName,
            lastname: lastName,
            othernames: otherName,
            dob: DOB
        }

        try {
            const response = await axios.post(verificationEndPoint, data, { headers: this.headers });
            const info = response.data.data;

            if(!info) throw new Error("Bad Request");
            
            if(
                (info.firstname).toLowerCase() !== firstName.toLowerCase() || 
                (info.lastname).toLowerCase() !== lastName.toLowerCase()
              ) 
              return res.status(StatusCodes.NOT_FOUND).json(
                { 
                    message: "KYC did not pass" 
                }
            );

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
            }
            
            const kyc = new KYC(kycData);

            kyc.status = "active";
            kyc.OTP = this.OTP;

            await kyc.save();
            
            const smsStatus = await new SendSMS().sendOtp(info.phone, this.OTP);
            
            return res.status(StatusCodes.OK).json(
                { 
                  Success: ReasonPhrases.OK, 
                  message: "An OTP has been sent to your phone number", 
                  smsStatus, 
                  result: info
              }
            );

        } catch(error: any) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: ReasonPhrases.INTERNAL_SERVER_ERROR });
        }
    }
}

