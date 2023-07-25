import { config } from 'dotenv'
import { Request, Response } from "express"
import { JwtPayload } from 'jsonwebtoken'
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { generateRefID } from '../../utils/generate_ref'
import { decodeToken } from '../../utils/decode_token'
import { headerType } from '../../../types_interfaces'

config()

export class FundWalletService {
    private reference: string;
    private budBaseUrl: string;
    private budKey: string;
    private headers: headerType

    constructor() {
        this.reference = generateRefID();
        this.budBaseUrl = process.env.budBaseUrl as string;
        this.budKey = process.env.bud_key as string;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        }
    }

    public encryptCard = async (req: Request, res: Response) => {
        const url = `${this.budBaseUrl}/s2s/test/encryption`;

        try {
            const { 
                amount, 
                number, 
                expiryMonth, 
                expiryYear, 
                cvv, 
                pin 
            } = req.body
    
            const cardData = {
                data: { 
                    number, 
                    expiryMonth, 
                    expiryYear, 
                    cvv 
                },
                reference: this.reference
            }
          
            const response = await axios.post(url, cardData, { headers: this.headers });
            const encryptedCard = response.data;

            return {
                encryptedCard,
                pin,
                amount,
                reference: this.reference
            }

        } catch (error: any) {
            throw error;
        }
    }

    public fundWallet = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const data = decodeToken(authHeader.split(" ")[1]) as JwtPayload;

        const payEndPoint = `${this.budBaseUrl}/s2s/transaction/initialize`;
        const cardObj = await this.encryptCard(req, res);

        try {
            const paymentPayload = {
                    amount: cardObj.amount , 
                    card: cardObj.encryptedCard, 
                    callback:"www.budpay.com",
                    currency: "NGN",
                    email: data.email,
                    pin: cardObj.pin,
                    reference: cardObj.reference
                }
        
            const response = await axios.post(payEndPoint, paymentPayload, { headers: this.headers });
            const info = response.data;
            return res.status(StatusCodes.OK).json({ info });

        } catch (error: any ) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message)
            console.error(error)
        }
    }
}