import { config } from 'dotenv'
import axios, { AxiosHeaders } from 'axios'
import { Request, Response } from "express"
import { JwtPayload } from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { generateRefID } from '../utils/generateRef'
import { decodeToken } from '../../middlewares/decodeToken'
import { KYC } from '../../models/KYC'

config()

const budKey = process.env.bud_key as string

// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
}

// Create Customer and account
export const createCustomer = async (req:Request, res:Response) => {
    // Get user data from auth token
    const authHeader = req.headers.authorization as string
    const data = decodeToken(authHeader.split(" ")[1]) as JwtPayload
    const url = "https://api.budpay.com/api/v2/customer"
    const kyc = await KYC.findOne({ user: data.userId })

    try { 
        if(!kyc) 
            return res.status(StatusCodes.NOT_FOUND).send("Not Found")
        if(!kyc.status)
            return res.status(StatusCodes.NOT_FOUND).send("KYC not complete")

        // Create customer
        const customer = {
            email: data.email,
            first_name: kyc.firstName,
            last_name: kyc.lastName,
            phone: kyc.phoneNumber
        }

        const response = await axios.post(url, customer, { headers })
        const info = response.data.data
        const customerCode = info.customer_code
        res.status(StatusCodes.OK).json(customerCode)
        return customerCode
    } catch(error:any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        console.error(error)
    }
} 

// Create account
export const createAccount = async(req:Request, res:Response) => {
    const url = "https://api.budpay.com/api/v2/dedicated_virtual_account"
    try {
        const customerCode = await createCustomer(req, res)
    
        const customerData = {
            customer_code: customerCode
        }
    
        const response = await axios.post(url, customerData, { headers })
        const info = response.data
        return res.status(StatusCodes.OK).json(info)
    } catch(error:any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        console.error(error)
    }

}