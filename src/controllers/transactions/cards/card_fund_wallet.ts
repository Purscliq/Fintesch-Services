import { config } from 'dotenv';
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { RefGenerator } from '../../utils/generate_ref';
import { Token } from '../../users/utils/token_service';
import { HeaderType } from '../../../types_interfaces';

config();

// returns an error from budpay at the moment
export class FundWalletService {
    private reference: string;
    private budBaseUrl: string;
    private budKey: string;
    private headers: HeaderType;
    private token: Token;

    constructor() {
        this.reference = new RefGenerator().instantiate();
        this.budBaseUrl = process.env.budBaseUrl as string;
        this.budKey = process.env.bud_key as string;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
        this.token = new Token;
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
            } = req.body;
    
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

            res.status(StatusCodes.OK).json(encryptedCard);

            return {
                encryptedCard,
                pin,
                amount,
                reference: this.reference
            };

        } catch (error: any) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }

    public fundWallet = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const data = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

        const payEndPoint = `${this.budBaseUrl}/s2s/transaction/initialize`;

        const cardObj: any = await this.encryptCard(req, res);

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
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }
}