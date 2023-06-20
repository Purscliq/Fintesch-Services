import { config } from 'dotenv'
import { Request, Response } from "express"
import { JwtPayload } from 'jsonwebtoken'
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { generateRefID } from '../utils/generateRef'
import { decodeToken } from '../utils/decodeToken'

config()

const budKey = process.env.bud_key as string

// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
}

// Get list of banks
export const bankList = async(req:Request, res:Response) => {
    const bankListUrl = "https://api.budpay.com/api/v2/bank_list"
    const header = {
        authorization: `Bearer ${budKey}` 
    }
    const response = await axios.get(bankListUrl, { headers: header })
    const bankList = response.data.data // returns an array of objects
    res.status(StatusCodes.OK).json({ bankList })
    return bankList
}

// Send Money via transfer
export const sendMoney = async(req:Request, res:Response) => {
    const { accountNumber, bankName, amount, narration } = req.body
    const url = "https://api.budpay.com/api/v2/bank_transfer"
    const bank_list = await bankList(req, res)

    interface Bank {
        bank_name: string,
        bank_code: string
    }

    try { 
        const bank = bank_list.find( (bankObj: Bank) => bankObj.bank_name === bankName )
        const bankCode = bank.bank_code
        const transferData = {
                currency: "NGN",
                amount,
                bank_code: bankCode,
                bank_name: bankName,
                account_number: accountNumber,
                narration
            }
        const response = await axios.post(url, transferData, { headers })
        const info = response.data
        console.log(info)
    } catch(error:any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        console.error(error)
    }
}
