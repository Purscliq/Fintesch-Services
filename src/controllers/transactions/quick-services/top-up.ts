import { config } from 'dotenv';
import axios from 'axios';
import { Request, Response } from 'express';
import { Token } from '../../users/utils/token_service';
import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { TopUp } from '../../../models/Top-up';

config();

export class TopUpService {
    private username: string;
    private password: string;
    private vtuBaseUrl: string;

    constructor() {
        this.username = process.env.vtu_username as string;
        this.password = process.env.vtu_password as string;
        this.vtuBaseUrl = process.env.vtu_baseUrl as string;
    };

   public airtime = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;
        const { phonenumber, network, amount } = req.body;

        const url = `${this.vtuBaseUrl}/airtime?username=${this.username}&password=${this.password}&phone=${phonenumber}&network_id=${network}&amount=${amount}`;
            
        try {
            const response = await axios.get(url);
            const data = response.data;

            console.log(data);

            const airtimeTopUpRecord = new TopUp(
                {
                    // user: userPayload.userId,
                    type: "airtime top up",
                    code: data.code,
                    message: data.message,
                    payment_data: data.data
                }
            );

            await airtimeTopUpRecord.save();

            return res.status(StatusCodes.OK).json(data);
        } catch(err: any) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
        } 
    }

    public data = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;

        const { phonenumber, network, amount } = req.body;
        
        const url = `${this.vtuBaseUrl}/data?username=${this.username}&password=${this.password}&phone=${phonenumber}&network_id=${network}&variation_id=M1024`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            const dataTopUpRecord = new TopUp({
                user: userPayload.userId,
                type: "data top up",
                code: data.code,
                message: data.message,
                payment_data: data.data
            });            
    
            console.log(data);
            await  dataTopUpRecord.save();
            return res.status(StatusCodes.OK).json(data);
        } catch(err: any) {
            console.error(err.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
        } 
    };
};
