import { config } from 'dotenv';
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { decodeToken } from '../utils/decode_token';
import { Card } from '../../models/Card';
import { Wallet } from '../../models/Wallet';
import { KYC } from '../../models/KYC';

config();

const sudoKey = process.env.sudoKey as string;

const headers = {
    authorization: `Bearer ${sudoKey}`,
    "content-type": "application/json",
    accept: 'application/json'
};

export const updateCardDetails = async(req: Request, res: Response) => {
    // const authHeader = req.headers.authorization as string;
    // const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
    const url = 'https://api.sandbox.sudo.cards/cards/:id';

    // const card = await Card.findOne({user: userPayload.userId}).select("id customer");
    try {
        const { status } = req.body;

        const data = {
            status
        }

        const response = await axios.put(url, data, { headers });

        const info = response.data;

        return res.status(StatusCodes.OK).json(info)
    } catch( err: any) {
        throw(err)
    }
}

export const changeCardPin = async(req: Request, res: Response) => {
    // const authHeader = req.headers.authorization as string;
    // const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
    const url = 'https://api.sandbox.sudo.cards/cards/:{id}/pin';

    // const card = await Card.findOne({user: userPayload.userId}).select("id customer");
    try {
        const { oldPin, newPin } = req.body;

        const data = {
            oldPin,
            newPin
        }

        const response = await axios.put(url, data, { headers });

        const info = response.data;

        return res.status(StatusCodes.OK).json(info)
    } catch( err: any) {
        throw(err)
    }
}