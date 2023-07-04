import { config } from 'dotenv'
import axios from 'axios'
import { Request, Response } from "express"
import { JwtPayload } from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { generateRefID } from '../utils/generateRef'
import { decodeToken } from '../utils/decodeToken'
import { KYC } from '../../models/KYC'

config()

const budKey = process.env.bud_key as string

export const acceptMoney = async(req:Request, res:Response) => {
    const authHeader = req.headers.authorization as string
    const data = decodeToken(authHeader.split(" ")[1]) as JwtPayload
    const kyc = await KYC.findOne({ user: data.userId })
    const reference = generateRefID()
    const url = "https://api.budpay.com/api/s2s/banktransfer/initialize"

    // set headers
    const headers = {
        authorization: `Bearer ${budKey}`,
        "content-type": "application/json"
    }

    try {
        if(!kyc) 
            return res.status(StatusCodes.NOT_FOUND).send("Not Found")
        if(!kyc.status)
            return res.status(StatusCodes.NOT_FOUND).send("KYC not complete")

        const name = kyc.firstName + " " + kyc.otherNames + " " + kyc.lastName
        const { amount } = req.body

        const paymentData = {
            email: data.email,
            amount,
            currency: "NGN",
            reference,
            name
        }

        const response = await axios.post(url, paymentData, { headers })
        const info = response.data
        return res.status(StatusCodes.OK).json(info)
    } catch(error:any) {
        throw error
    }
}