// IMPORT DEPENDENCIES
import { config } from 'dotenv';
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { decodeToken } from '../utils/decode_token';
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

// CREATE CARD FUNCTION
export const createCard = async(req: Request, res: Response) => {
    const authHeader = req.headers.authorization as string;
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
    const url = 'https://api.sandbox.sudo.cards/cards';
    const wallet = await Wallet.findOne({user: userPayload.userId}).select("id status currency");

    if(!wallet)
        throw Error;

    // creates a card customer 
    const customer = await createCardHolder(req, res);

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
    
          const response = await axios.post(url, cardData, { headers });
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
          res.status(StatusCodes.OK).json(card)
    } catch(err: any) {
        console.log(err.status, err.message)
        throw err
    }
}