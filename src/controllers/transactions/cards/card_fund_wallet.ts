import { config } from 'dotenv'
import { Request, Response } from "express"
import { JwtPayload } from 'jsonwebtoken'
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { generateRefID } from '../../utils/generate_ref'
import { decodeToken } from '../../utils/decode_token'
import { Wallet } from '../../../models/Wallet'

config()

const budKey = process.env.bud_key as string

// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
}

// ENCRYPT CARD
export const fundWallet = async(req:Request, res:Response) => {
    const authHeader = req.headers.authorization as string
    const data = decodeToken(authHeader.split(" ")[1]) as JwtPayload
    const reference = generateRefID()
    const url = "https://api.budpay.com/api/s2s/test/encryption"
    const payUrl = "https://api.budpay.com/api/s2s/transaction/initialize"

    const wallet: any = await Wallet.findOne({ user: data.userId }).select("user")

    try {
        // get card details
        const { amount, number, expiryMonth, expiryYear, cvv, pin } = req.body

        const budData = {
            data: { number, expiryMonth, expiryYear, cvv },
            reference
        }
        // Make axios API call to encrypt card
        const response = await axios.post(url, budData, { headers })
        const encryptedCard = response.data

        console.log(encryptedCard)

        // Initialize Wallet Funding
        const paymentData = {
                amount, 
                card: encryptedCard, 
                callback:"www.budpay.com",
                currency: "NGN",
                email: data.email,
                pin,
                reference
            }
        
        const resp = await axios.post(payUrl, paymentData, { headers })
        const resInfo = resp.data
        console.log(resInfo)
        return res.status(StatusCodes.OK).json({ resInfo })
    } catch( error: any ) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message)
        console.error(error)
    }
}