import { config } from 'dotenv'
import { Request, Response } from "express"
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { Transaction } from '../../models/Transaction'
import { Account } from '../../models/Account'
// import { generateRefID } from '../utils/generateRef'
import { decodeToken } from '../utils/decodeToken'
import { JwtPayload } from 'jsonwebtoken'

config()
const budKey = process.env.bud_key as string

// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
}

// Get list of banks
export const bankList = async(req: Request, res: Response) => {
    const bankListUrl = "https://api.budpay.com/api/v2/bank_list"
    // set header
    const header = {
        authorization: `Bearer ${budKey}` 
    }
    // make api call to external service
    try {
        const response = await axios.get(bankListUrl, { headers: header })
        const bankList = response.data.data // returns an array of objects
        return res.status(StatusCodes.OK).json({ bankList })
    } catch(error: any) {
        console.error(error)
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred with generating bank list")
    }
}

// Account Name validation
// @ Runs upon receiving bank name and account number input 
export const accountNameValidation = async(req: Request, res: Response) => {
    const url = "https://api.budpay.com/api/v2/account_name_verify"
    // set header
    const headers = {
        authorization: `Bearer ${budKey}`,
        "content-type": "application/json"
    }
    // make api call to external service
    try {
         // validate parameters
         const validationData = {
            bank_code: req.body.bankCode,
            account_number: req.body.accountNumber,
            currency: "NGN"
        }
        const response = await axios.post(url, validationData, { headers })
        const accountName = response.data.data
        return res.status(StatusCodes.OK).json(accountName)
    } catch(error: any) {
        console.error(error)
    }
}

// Send Money via transfer
export const sendMoney = async(req:Request, res:Response) => {
    const authHeader = req.headers.authorization as string
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload

    const { accountNumber, bankName, bankCode, amount, narration } = req.body
    const url = "https://api.budpay.com/api/v2/bank_transfer"

    try { 
        // transfer parameters
        const transferData = {
                currency: "NGN",
                amount,
                bank_code: bankCode,
                bank_name: bankName,
                account_number: accountNumber,
                narration
            }

        // make api call to budpay
        const response = await axios.post(url, transferData, { headers })
        const info = response.data
        console.log(info)

        if(!info) {
            throw("Transfer not successful")
        }

        await Transaction.create({
            user: userPayload.userId,
            ...(info.data)
        })

        const account = await Account.findOne({ user: userPayload.userId })

        if(!account) 
            return res.status(StatusCodes.NOT_FOUND).send("This account does not exist")

        const balance = (account.balance) - parseInt(amount)

        if(balance < 0.00) 
            return res.status(StatusCodes.BAD_REQUEST).send("Insufficient Balance")

        account.balance = balance
        await account.save()
        
        return res.status(StatusCodes.OK).json(info)
    } catch(error:any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        console.error(error)
    }
}
















// export const verifyPayout = async(req: Request, res: Response) => {
//     const url = "https://budpay.com/api/v2/payout/:reference"
//     const headers = {
//         authorization: `Bearer ${budKey}`,
//     }
//     try {
//         const reference = await Transaction.findOne( {} )
//         const response = await axios.post(url, transferData, { headers })
//     } catch(err: any) {

//     }
// }
