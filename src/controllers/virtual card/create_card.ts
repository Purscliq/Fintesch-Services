import { config } from 'dotenv';
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { decodeToken } from '../utils/decodeToken';
import { Card } from '../../models/Card';
import { Wallet } from '../../models/Wallet';
import { createCardHolder } from './create_cardholder';

config();
const sudoKey = process.env.sudoKey as string;

const headers = {
    authorization: `Bearer ${sudoKey}`,
    "content-type": "application/json",
    accept: 'application/json'
};


export const createCard = async(req: Request, res: Response) => {
    const authHeader = req.headers.authorization as string;
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
    const wallet = await Wallet.findOne({user: userPayload.userId}).select("id customer");

    if(!wallet)
        throw Error;

    const customer = await createCardHolder(req, res);

    try {
        const url = 'https://api.sandbox.sudo.cards/cards';
        const cardData = {
            customerId: customer.id,
            fundingSourceId: wallet.id,
            type: "virtual",
            currency: "NGN",
            issuerCountry: "NGA",
            status: "active",
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
    
          const response = await axios.post(url, cardData, { headers });
          const data = response.data;
          console.log(data);

          const card = new Card(data);
          await card.save()
          res.status(StatusCodes.OK).json(card)
    } catch(err: any) {
        console.log(err.status, err.message)
        throw err
    }
}