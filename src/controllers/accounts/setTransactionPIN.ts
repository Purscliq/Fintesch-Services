import { Request, Response } from "express"
import { decodeToken } from "../utils/decodeToken"
import { Account } from "../../models/Account"
import { JwtPayload } from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"

export const setTransactionPIN = async(req:Request, res:Response) => {
    try {
        const { PIN } = req.body
        const authHeader = req.headers.authorization as string
        const userPayload = decodeToken(authHeader.split(" ") [1]) as JwtPayload

        // save PIN to database
        const account = await Account.findOne({ user: userPayload.userId }).select("PIN")
        if(!account) return res.status(StatusCodes.NOT_FOUND).send("Your account could not be retrieved")
        account.PIN = PIN
        await account.save()
        return res.status(StatusCodes.OK).json({
            Success: "PIN has been successfully set"
        })
    } catch(error: any) {
        throw error
    }
}