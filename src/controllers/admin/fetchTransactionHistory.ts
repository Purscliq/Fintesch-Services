import { config } from 'dotenv'
import { Request, Response } from "express"
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'

config()
const budKey = process.env.bud_key as string

export const fetchTransactionHistory = async(req: Request, res: Response) => {
    const historyUrl = "https://api.budpay.com/api/v2/wallet_transactions/NGN"
    const header = {
        authorization: `Bearer ${budKey}` 
    }
    try {
        const response = await axios.get(historyUrl, { headers: header })
        const transactionHistory = response.data.data
        return res.status(StatusCodes.OK).json(transactionHistory)
    } catch(error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        console.error(error)
    }
}