import {config} from 'dotenv'
import { Request, Response } from "express"
import axios from 'axios'
import { decodeToken } from "./decode_token"
import { KYC } from "../../models/KYC"
import { JwtPayload } from "jsonwebtoken"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { sendSMS } from './send_sms'
import { generateOTP } from './generate_otp'
import { headerType } from '../../types_interfaces'


config();


export class KnowYourCustomer {
    private kycBaseUrl: string 
    private liveKey: string
    private headers: headerType
    private OTP: number

    constructor() {
        this.kycBaseUrl = process.env.verifyMeBaseUrl as string;
        this.liveKey = process.env.verifyMeKey as string;
        this.headers = {
            authorization: `Bearer ${this.liveKey}`,
            'content-type': 'application/json'
        };
        this.OTP = generateOTP();
    }

    public verifyBvn = async (req:Request, res:Response) => {

        const authHeader = req.headers.authorization as string;
        const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;

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
        } = req.body

        try {
            const verificationEndPoint = `${this.kycBaseUrl}/v1/verifications/identities/bvn/${BVN}`

            const data = {
                firstname: firstName,
                lastname: lastName,
                othernames: otherName,
                dob: DOB
            }

            const response = await axios.post(verificationEndPoint, data, { headers: this.headers })
            const info = response.data.data

            if(!info) {
                throw Error;
            }
            
            if(
                (info.firstname).toLowerCase() !== firstName.toLowerCase() || 
                (info.lastname).toLowerCase() !== lastName.toLowerCase()
              ) 
              return res.status(StatusCodes.NOT_FOUND).json({ message: "KYC did not pass" })

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
            
            const smsStatus = await sendSMS(req, res, info.phone, this.OTP);
            
            // return result
            return res.status(StatusCodes.OK).json(
                { 
                  Success: ReasonPhrases.OK, 
                  message: "An OTP has been sent to your phone number", 
                  smsStatus, 
                  result: info
              }
            );

        } catch(error: any) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
        }
    }
}

