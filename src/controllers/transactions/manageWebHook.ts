import { config } from 'dotenv'
import axios from 'axios'
import { Request, Response } from "express" 
import { JwtPayload } from "jsonwebtoken"
import { decodeToken } from "../utils/decodeToken"
import { Transaction } from "../../models/Transaction"
import { Account } from "../../models/Account"

config();
const budKey = process.env.bud_key as string

// set headers
const headers = {
    authorization: `Bearer ${budKey}`
}

export const transactionWebHook = async(req: Request, res: Response) => {
    const authHeader = req.headers.authorization as string
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload
    const { notify, notifyType, data } = req.body
    const verifyUrl = `//api.budpay.com/api/v2/transaction/verify/:${data.reference}`

    try{
        if(notify === "transaction" && notifyType === "successful") {
            const transactionData = {
                user: userPayload.userId,
                ...data
            }
            // Save transfer details to database
            const transaction = new Transaction(transactionData)
            await transaction.save()

            // verify transaction
            const response = await axios.get(verifyUrl, { headers })
            const verifiedTransaction = response.data
            console.log(verifiedTransaction)

            if(verifiedTransaction.message !== "message successful") 
                throw("Transaction Failed")

            const account: any = await Account.findOne({ user: userPayload.userId })
            account.balance = (account.balance) + parseInt(verifiedTransaction.data.amount)
            account.status = verifiedTransaction.data.status
            await account.save();
        } else if(notify === "payout" && notifyType === "successful") {
            const transaction: any = await Transaction.findOne({ user: userPayload.userId })
            const response = await axios.get(verifyUrl, { headers })
            const verifiedTransaction = response.data
            console.log(verifiedTransaction)

            if(verifiedTransaction.message !== "message successful") 
                throw("Transaction Failed")

            if(verifiedTransaction.data.status === "failed")

            transaction.status = verifiedTransaction.data.status
            await transaction.save();
        }
        
    } catch (error: any) {
        console.log(error)
    }
}