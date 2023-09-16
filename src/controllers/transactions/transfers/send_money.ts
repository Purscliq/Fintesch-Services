import { config } from 'dotenv';
import { Request, Response } from "express";
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Transaction } from '../../../models/Transaction';
import { Wallet } from '../../../models/Wallet';
import { Token } from '../../users/utils/token_service'
import { JwtPayload } from 'jsonwebtoken';

config();

export class SendMoneyService {
    private headers;
    private budKey: string;
    private budBaseUrl: string;
    private token: Token;

    constructor() {
        this.budKey = process.env.bud_key as string;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
        this.budBaseUrl = process.env.budBaseUrl as string;
        this.token = new Token;
    }

    public getBankList = async(req: Request, res: Response) => {
        const bankListUrl = `${this.budBaseUrl}/v2/bank_list`;

        try {
            const response = await axios.get(bankListUrl, { headers: { authorization: `Bearer ${this.budKey}` }});

            // returns an array of objects
            const bankList = response.data.data;

            return res.status(StatusCodes.OK).json({ bankList });

        } catch(error: any) {
            console.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("An error occurred with generating bank list");
        }
    };

    public accountNameValidation = async (req: Request, res: Response) => {
        const validationData = {
            bank_code: req.body.bankCode,
            account_number: req.body.accountNumber,
            currency: "NGN"
        };

        try {
            const url = `${this.budBaseUrl}/v2/account_name_verify`;

            const response = await axios.post(url, validationData, { headers: this.headers});

            const walletName = response.data.data;

            return res.status(StatusCodes.OK).json(walletName);

        } catch(error: any) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("An unexpected error occurred");
        }
    };

    public sendMoney = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

        const { 
            accountNumber, 
            bankName, 
            bankCode, 
            amount, 
            narration, 
            PIN 
        } = req.body;

        const wallet = await Wallet.findOne({user: userPayload.userId}).select("PIN balance");

        if(!wallet) return res.status(StatusCodes.NOT_FOUND).json("This account does not exist");

        if(PIN !== wallet.PIN) return res.status(StatusCodes.FORBIDDEN).json({ error: "Wrong PIN" });
    
        if((wallet.balance) < (parseInt(amount) + 20.00)) return res.status(StatusCodes.BAD_REQUEST).json({ Error: "Insufficient Balance" });

        const sendMoneyPayload = {
            currency: "NGN",
            amount,
            bank_code: bankCode,
            bank_name: bankName,
            account_number: accountNumber,
            narration
        };

        try {
            const url = `${this.budBaseUrl}/v2/bank_transfer`;
            const response = await axios.post(url,  sendMoneyPayload, { headers: this.headers });
            const info = response.data;

        if(!info || info.status !== true) {
            return res.status(StatusCodes.BAD_REQUEST).json(
                { 
                    error: "Transaction Failed", 
                    info 
                }
            )
        };

        const { data } = info;

        console.log(data);

        await Transaction.create({
            user: userPayload.userId,
            ...data
        })

        const newBalance = (wallet.balance) - parseInt(amount);

        wallet.balance = newBalance;

        await wallet.save();
    
        return res.status(StatusCodes.OK).json(info);

    } catch(error: any) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }
};