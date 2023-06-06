import { Request, Response } from "express"
import { decodeToken } from "../middlewares/decodeToken"
import { User } from "../models/User"
import { JwtPayload } from "jsonwebtoken"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

export const KYC = async (req:Request, res:Response) => {
    try {
        const { firstName, lastName, DOB, phoneNumber, address } = req.body
        const data = decodeToken(req.cookies.jwt) as JwtPayload
        const user = await User.findOne({ email: data.email })

        if(!user) return res.send("Not Found")

        user.firstName = firstName
        user.lastName = lastName
        user.phoneNumber = phoneNumber
        user.address = address
        user.DOB = DOB

        await user.save()
        return res.status(StatusCodes.OK).json({ Success: ReasonPhrases.OK, message: "KYC complete" })
    } catch(error:any) {
        return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_GATEWAY)
    }
}