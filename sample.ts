import {config} from 'dotenv'
import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import axios from axios
import { decodeToken } from "../../middlewares/decodeToken"
import { KYC } from "../../models/KYC"
import { Account } from "../../models/Account"
import { JwtPayload } from "jsonwebtoken"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

config()

const liveKey = process.env.verifyMe_key as string

export const createVirtualAccount = async (req:Request, res:Response) => {
    try {
        const authHeader = req.headers.authorization as string
        const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload
        const { firstName, lastName, otherName, BVN, DateOfBirth, phoneNumber, 
            address, gender, nationality, idType, idNumber, issueDate, expiryDate 
        } = req.body

        // PERFORM KYC
        const url = `https://vapi.verifyme.ng/v1/verifications/identities/bvn/${BVN}`
        const headers = {
            authorization: `Bearer ${liveKey}`,
            'Content-Type': 'application/json'
        }
        const data = {
            firstname: firstName ,
            lastname: lastName,
            dob: DateOfBirth
        }
        
        const response = await axios(url, data, { headers })
        const info = response.data.data
        const names = info.fieldMatches

        if(!names.first_name && names.last_name)
            return res.status(StatusCodes.OK).json({ message: "KYC did not pass" })

        const encryptBVN = await bcrypt.hash(BVN, bcrypt.genSaltSync(10))
        const kycData = {
            user: userPayload.userId, firstName, lastName, otherName, phoneNumber,
            BVN: encryptBVN, address, gender, nationality, idType, idNumber, issueDate, expiryDate,
            DateOfBirth
        }

        const kyc = new KYC({ kycData })
        await kyc.save()
        return res.status(StatusCodes.OK).json({ Success: ReasonPhrases.OK, message: "Kyc Verified" })
    } catch(error:any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
}

export const setTransactionPIN = async(req:Request, res:Response) => {
    try {
        const { PIN } = req.body
        const authHeader = req.headers.authorization as string
        const userPayload = decodeToken(authHeader.split(" ") [1]) as JwtPayload
        const account = await Account.findOne({ user: userPayload.userId })
        if(!account) return res.status(StatusCodes.NOT_FOUND).send("Your account could not be retrieved")
        account.PIN = PIN
        await account.save()
    } catch(error: any) {
        throw error
    }
}