import { config } from 'dotenv';
import axios from 'axios';
import { Request, Response } from 'express';
import { Token } from '../../users/utils/token_service';
import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { Bills } from '../../../models/Pay-bills';
import { KYC } from '../../../models/KYC';

config();

export class PayBill {
    private username: string;
    private password: string;
    private vtuBaseUrl: string;

    constructor() {
        this.username = process.env.vtu_username as string;
        this.password = process.env.vtu_password as string;
        this.vtuBaseUrl = process.env.vtu_baseUrl as string;
    };

    public electricity = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;

        const phonenumber: any = await KYC.findOne({user: userPayload.userId}).select("phoneNumber");

        const { meter_number, provider, variation_id, amount} = req.body;
        
        const url =  `${this.vtuBaseUrl}/electricity?username=${this.username}&password=${this.password}&phone=${phonenumber.phoneNumber}&meter_number=${ meter_number}&service_id=${provider}&variation_id=${variation_id}&amount=${amount}`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            console.log(data);

            const billpaymentRecord = new Bills(
                {
                    user: userPayload.userId,
                    type: "Electricity",
                    code: data.code,
                    message: data.message,
                    payment_data: data.data
                }
            );            
    
            await billpaymentRecord.save();

            return res.status(StatusCodes.OK).json(data);

        } catch(err: any) {
            console.error(err.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
        } 
    };

    public cableTv = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;

        const phonenumber: any = await KYC.findOne({user: userPayload.userId}).select("phoneNumber");

        const { smartcard_number, provider, variation_id} = req.body;
        
        const url = `${this.vtuBaseUrl}/tv?username=${this.username}&password=${this.password}&phone=${phonenumber.phoneNumber}&service_id=${provider}&smartcard_number=${smartcard_number}&variation_id=${variation_id}`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            console.log(data);

            const billpaymentRecord = new Bills(
                {
                    user: userPayload.userId,
                    type: "Cable-tv",
                    code: data.code,
                    message: data.message,
                    payment_data: data.data
                }
            );            
    
            await billpaymentRecord.save();

            return res.status(StatusCodes.OK).json(data);
        } catch(err: any) {
            console.error(err.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
        } 
    };
};
