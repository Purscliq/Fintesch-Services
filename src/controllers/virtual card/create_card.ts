import { config } from 'dotenv';
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Token } from '../users/utils/token_service';
import { Card } from '../../models/Card';
import { Wallet } from '../../models/Wallet';
import { KYC } from '../../models/KYC';

config();

export class CardService {
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

    public createCardHolder = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

        const url = `${this.sudoBaseUrl}/customers`;

    try {
        const holder = await KYC.findOne({ user: userPayload.userId }).populate("user");

        if(!holder) throw new Error('something went wrong');

        const fullname = holder.firstName + " " + holder.firstName + " " + holder.otherNames

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

        const response = await axios.post(url, holderData, { headers: this.headers });
        const holderInfo = response.data.data;
        return holderInfo;

    } catch(err: any) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An expected error occurred")
    }
};

    public createCard = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization as string;
        const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

        const url = `${this.sudoBaseUrl}/cards`;

        const wallet = await Wallet.findOne({user: userPayload.userId}).select("id status currency");

        if(!wallet) throw new Error('Something went wrong');

        const customer = await this.createCardHolder(req, res);

        try {
            const cardData = {
                customerId: customer._id,
                fundingSourceId: wallet.id,
                type: "virtual",
                currency: wallet.currency,
                issuerCountry: "NGA",
                status: wallet.status,
                spendingControls: {
                    channels: {
                        atm: true,
                        pos: true,
                        web: true,
                        mobile: true
                    }
                },
                sendPINSMS: false,
                brand: "Verve"
                }

                const response = await axios.post(url, cardData, { headers: this.headers });
                const data = response.data;
                console.log(data);

                if(!data || data.statusCode === 400) {
                return res.status(StatusCodes.BAD_REQUEST).json(
                    { 
                        error: data.error,
                        message: data.message
                    }
                );
                }

                const card = new Card({});
                await card.save();
                return res.status(StatusCodes.OK).json(card);
        } catch(err: any) {
            console.log(err.status, err.message)
            throw err
        }
    };
}