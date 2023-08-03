import { config } from 'dotenv'
import axios from 'axios'
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { RefGenerator } from '../../utils/generate_ref';
import { Token } from '../../users/utils/token_service';
import { KYC } from '../../../models/KYC';
import { HeaderType } from '../../../types_interfaces';

config();

export class OneTimePayment {
    private headers: HeaderType;
    private budKey: string;
    private budBaseUrl: string;
    private reference: string;
    private token: Token;

    constructor() {
        this.budKey = process.env.bud_key as string;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
        this.budBaseUrl = process.env.budBaseUrl as string;
        this.reference = new RefGenerator().instantiate();
        this.token = new Token;
    }

    // not tested
    public acceptMoney = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const data = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

        const kyc = await KYC.findOne({ user: data.userId });

        const url = `${this.budBaseUrl}/s2s/banktransfer/initialize`;
    
        try {
            if(!kyc) 
                return res.status(StatusCodes.BAD_REQUEST).json("Request could not be completed");

            if(!kyc.status)
                return res.status(StatusCodes.BAD_REQUEST).json("KYC not complete");
    
            const name = kyc.firstName + " " + kyc.otherNames + " " + kyc.lastName;

            const { amount } = req.body;
    
            const paymentData = {
                email: data.email,
                amount,
                currency: "NGN",
                reference: this.reference,
                name
            }
    
            const response = await axios.post(url, paymentData, { headers: this.headers })
            const info = response.data
            return res.status(StatusCodes.OK).json(info)
        } catch(error:any) {
            throw error
        }
    }
}

