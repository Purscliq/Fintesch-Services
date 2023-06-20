import {config} from 'dotenv'
import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import axios from 'axios'
import { decodeToken } from "../utils/decodeToken"
import { KYC } from "../../models/KYC"
import { JwtPayload } from "jsonwebtoken"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { generateOTP } from '../utils/generateOTP'

config()

const liveKey = process.env.verifyMe_key as string
// const testKey = process.env.testKey as string

// Verify user via BVN
export const bvnVerification = async (req:Request, res:Response) => {
    // Get user token from auth header
    const authHeader = req.headers.authorization as string
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload

    // Get KYC details
    const { 
            firstName, 
            lastName, 
            BVN, 
            dateOfBirth, 
            otherName, 
            phoneNumber,
            address, 
            gender, 
            nationality, 
            idType, 
            idNumber, 
            issueDate, 
            expiryDate
        } = req.body

    // PERFORM KYC
    try {
        const url = `https://vapi.verifyme.ng/v1/verifications/identities/bvn/${BVN}`
        const headers = {
            authorization: `Bearer ${liveKey}`,
            'Content-Type': 'application/json'
        }
        const data = {
            firstname: firstName,
            lastname: lastName,
            dob: dateOfBirth
        }
        const response = await axios.post(url, data, { headers })
        const info = response.data.data
        let middlename = info.middlename
        middlename = middlename.charAt(0).toUpperCase() + middlename.slice(1).toLowerCase();

        if((info.firstname).toLowerCase() !== firstName.toLowerCase() || (info.lastname).toLowerCase() !== lastName.toLowerCase())
            return res.status(StatusCodes.NOT_FOUND).json({ message: "KYC did not pass" })

        // Save KYC details to DB
        const encryptBVN = await bcrypt.hash(String(BVN), bcrypt.genSaltSync(10))
        const kycData = {
            user: userPayload.userId, 
            firstName, 
            lastName,
            BVN: encryptBVN, 
            dateOfBirth: dateOfBirth,
            otherName: middlename, 
            phoneNumber, 
            address, 
            gender, 
            nationality, 
            idType, 
            idNumber, 
            issueDate, 
            expiryDate,
        }

        const kyc = new KYC(kycData)
        kyc.status = true
        await kyc.save()

        // SEND OTP TO PHONE NUMBER

        // return result
        return res.status(StatusCodes.OK).json({ 
            Success: ReasonPhrases.OK, 
            message: "An OTP will be sent to your Phone number",  
            result: info
        })
    } catch(error:any) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
}

