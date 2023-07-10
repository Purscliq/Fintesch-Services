import { config } from 'dotenv'
import axios from 'axios'
import { Request, Response } from "express" 
import { JwtPayload } from "jsonwebtoken"
import { decodeToken } from "../../utils/decode_token"
import { Transaction } from "../../../models/Transaction"
import { Wallet } from "../../../models/Wallet"
import { StatusCodes } from 'http-status-codes'

config();
const budKey = process.env.bud_key as string

// set headers
const headers = {
    authorization: `Bearer ${budKey}`
}

export const updateBalance = async(req: Request, res: Response) => {
    const authHeader = req.headers.authorization as string
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload

    const { notify, notifyType, data } = req.body

    const verifyUrl = `//api.budpay.com/api/v2/transaction/verify/:${data.reference}`

    const payOutUrl = `https://budpay.com/api/v2/payout/:${data.reference}`

    try{
        if(notify === "transaction" && notifyType === "successful") {
            const transactionData = {
                user: userPayload.userId,
                ...data
            }
           
            // verify transaction
            const response = await axios.get(verifyUrl, { headers });

            const result = response.data

            // display result
            console.log(result)

            if (result.status !== true && data.currency !== result.data.currency) {
                throw("Invalid transaction")
            }

            const wallet: any = await Wallet.findOne({ user: userPayload.userId }).select("balance");

            wallet.balance = (wallet.balance) + parseInt(result.data.amount);

            wallet.status = result.data.status;

             // Save transfer details to database
             const transaction = new Transaction(transactionData);

             console.log(transaction);

            await transaction.save();

            // update wallet status with transaction status from webhook

            await wallet.save();

            return res.status(StatusCodes.OK).json(wallet);
        } 
        else if(notify === "payout" && notifyType === "successful") {
            // verify transaction
            const transaction: any = await Transaction.findOne({ user: userPayload.userId });

            const response = await axios.get(payOutUrl, { headers });

            const result = response.data;

            console.log(result);

            if (result.status !== true && data.currency !== result.data.currency) {
                throw("Invalid transaction")
            }

            transaction.status = result.data.status;
            console.log(transaction);
            
            // Save transfer details to database
            await transaction.save();

            return res.status(StatusCodes.OK).json( { 
                message: `Transaction ${transaction.status}` 
            });
        }
    } catch (error: any) {
        console.log(error)
    }
}

// data.amount !== result.data.amount &&