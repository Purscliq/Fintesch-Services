import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import { decodeToken } from "../../middlewares/decodeToken"
import { KYC } from "../../models/KYC"
import { Account } from "../../models/Account"
import { JwtPayload } from "jsonwebtoken"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

export const createAccount = async (req:Request, res:Response) => {
    try {
        // PERFORM KYC
        const { firstName, lastName, otherName, BVN, DateOfBirth, phoneNumber, 
                address, gender, nationality, idType, idNumber, issueDate, expiryDate 
            } = req.body

        const encryptBVN = await bcrypt.hash(BVN, bcrypt.genSaltSync(10))
        const authHeader = req.headers.authorization as string
        const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload
        const data = {
            user: userPayload.userId, firstName, lastName, otherName, phoneNumber,
            BVN: encryptBVN, address, gender, nationality, idType, idNumber, issueDate, expiryDate,
            DateOfBirth
        }

        const kyc = new KYC({ data })
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