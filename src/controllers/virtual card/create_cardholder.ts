import { config } from 'dotenv';
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { decodeToken } from '../utils/decode_token';
import { KYC } from '../../models/KYC';
import { Card } from '../../models/Card';
import { Wallet } from '../../models/Wallet';
import { User } from '../../models/User';

config();
const sudoKey = process.env.sudoKey as string;

const headers = {
    authorization: `Bearer ${sudoKey}`,
    "content-type": "application/json",
    accept: 'application/json'
}

export const createCardHolder = async(req: Request, res: Response) => {
    const authHeader = req.headers.authorization as string;
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
    const url = 'https://api.sandbox.sudo.cards/customers';
    
    try {
        const holder = await KYC.findOne({ user: userPayload.userId }).populate("user")

        if(!holder)
            throw("Holder is null")

        const fullname = holder.firstName + " " + holder.firstName + " " + holder.otherNames

        // card holder data
        const holderData =  {
            type: userPayload.role,
            name: fullname,
            individual: {
                firstName: holder.firstName,
                lastName: holder.firstName,
                otherNames: holder.otherNames,
                dob: holder.DOB,
            },
            status: holder.status,
            billingAddress: {
                line1: holder.address,
                city: holder.city,
                state: holder.state,
                postalCode: holder.postalCode,
                country: holder.country,
            },
            phoneNumber: holder.phoneNumber,
            emailAddress: holder.user.email
        }

        const response = await axios.post(url, holderData, { headers });
        // Response Information
        const holderInfo = response.data.data;

        console.log(response.data);

        return holderInfo;
    } 
    catch(err: any) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An expected error occurred")
    }
}