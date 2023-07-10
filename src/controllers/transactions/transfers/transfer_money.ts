// IMPORT DEPENDENCIES
import { config } from 'dotenv';
import { Request, Response } from "express";
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Transaction } from '../../../models/Transaction';
import { Wallet } from '../../../models/Wallet';
import { decodeToken } from '../../utils/decode_token';
import { JwtPayload } from 'jsonwebtoken';
// import { generateRefID } from '../utils/generateRef';

config()
const budKey = process.env.bud_key as string

// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
}

// GET LISTS OF BANKS AND BANK CODE
export const bankList = async(req: Request, res: Response) => {
    const bankListUrl = "https://api.budpay.com/api/v2/bank_list";

    // set header
    const header = {
        authorization: `Bearer ${budKey}` 
    };

    // make api call to external service
    try {
        const response = await axios.get(bankListUrl, { headers: header });
        const bankList = response.data.data; // returns an array of objects
        return res.status(StatusCodes.OK).json({ bankList });
    } catch(error: any) {
        console.error(error);
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred with generating bank list");
    }
}

// ACCOUNT NAME VALIDATION
// @ Runs upon receiving bank name and account number input 
export const accountNameValidation = async(req: Request, res: Response) => {
    const url = "https://api.budpay.com/api/v2/account_name_verify";

    // set header
    const headers = {
        authorization: `Bearer ${budKey}`,
        "content-type": "application/json"
    };

    // make api call to external service
    try {
         // validation payload
         const validationData = {
            bank_code: req.body.bankCode,
            account_number: req.body.accountNumber,
            currency: "NGN"
        }
        const response = await axios.post(url, validationData, { headers })
        const walletName = response.data.data
        return res.status(StatusCodes.OK).json(walletName)
    } catch(error: any) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("An unexpected error occurred")
    }
}

// SEND MONEY VIA TRANSFER
export const sendMoney = async(req:Request, res:Response) => {
    const authHeader = req.headers.authorization as string
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload

    const { accountNumber, bankName, bankCode, amount, narration, PIN } = req.body

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

        const wallet = await Wallet.findOne({user: userPayload.userId})

        if(!wallet) 
            return res.status(StatusCodes.NOT_FOUND).send("This account does not exist")

        // Verify that Transaction PIN is correct
        if(PIN !== wallet.PIN) {
            res.status(StatusCodes.FORBIDDEN).json({ error: "Wrong PIN" });
            throw("Wrong PIN");
        }
        
        // Check for sufficient balance to carry out Transcation
        if((wallet.balance) < (parseInt(amount) + 20.00))
            return res.status(StatusCodes.BAD_REQUEST).send("Insufficient Balance")

        // if there is sufficient amount, make api call to budpay
        const response = await axios.post(url, transferData, { headers });

        const info = response.data;

        if(!info || info.status !== true) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Transaction Failed" });
        }

        // Save transaction details to Transaction collection
        const { data } = info;
        console.log(data);

        await Transaction.create({
            user: userPayload.userId,
            ...data
        })

        // Deduct withdrawal amount from available balance and update wallet balance
        const balance = (wallet.balance) - parseInt(amount);

        wallet.balance = balance;

        await wallet.save();
        
        return res.status(StatusCodes.OK).json(info);
    } catch(error:any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        console.error(error)
    }
}