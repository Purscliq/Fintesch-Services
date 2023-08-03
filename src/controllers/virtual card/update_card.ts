import { config } from 'dotenv';
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Card } from '../../models/Card';
import { Token } from '../users/utils/token_service';

config();

export class UpdateCard {
    private sudoKey: string;
    private headers: object;
    private token: Token;
    private sudoBaseUrl: string;
    
    constructor() {
    this.sudoKey = process.env.sudoKey as string;
    this.sudoBaseUrl = process.env.sudo_baseurl as string;
    this.token = new Token;
    this.headers = {
        authorization: `Bearer ${this.sudoKey}`,
        "content-type": "application/json",
        accept: 'application/json'
    };
    }

    updateCardDetails = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;
    
        const card: any = await Card.findOne({user: userPayload.userId}).select("id customer");
        const url = `${this.sudoBaseUrl}/cards:${card.id}`;
    
        try {
            const { status } = req.body;
    
            const data = {
                status
            }
    
            const response = await axios.put(url, data, { headers: this.headers });
    
            const info = response.data;
    
            return res.status(StatusCodes.OK).json(info)
        } catch( err: any) {
            throw(err)
        }
    }
    
    changeCardPin = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;

        const card: any = await Card.findOne({user: userPayload.userId}).select("id customer");
        const url = `${this.sudoBaseUrl}/cards:${card.id}/pin`;

        try {
            const { oldPin, newPin } = req.body;
    
            const data = {
                oldPin,
                newPin
            }
    
            const response = await axios.put(url, data, { headers: this.headers });
    
            const info = response.data;
    
            return res.status(StatusCodes.OK).json(info)
        } catch( err: any) {
            throw(err)
        }
    }
}
