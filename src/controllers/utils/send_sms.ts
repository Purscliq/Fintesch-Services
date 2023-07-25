// IMPORT DEPENDENCIES
import { config } from 'dotenv';
import axios from 'axios';
// import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

config();

const termiKey = process.env.termiKey as string;

const headers = {
    'Content-Type': ['application/json', 'application/json']
  }

export const getSenderId = async () => {
    const url = `https://api.ng.termii.com/api/sender-id?api_key=${termiKey}`

    const response = await axios.get(url, { headers });
    const result = response.data;
    const senderID = result.data[0].sender_id
    console.log(senderID);
    return senderID;
}

// Function to send OTP via SMS 
export const sendSMS = async( req: Request,  res: Response, phoneNumber: string, OTP: Number) => {
    const termiiUrl = "https://api.ng.termii.com/api/sms/send";

    const senderID = await getSenderId();

    const smsData = {
        api_key: termiKey,
        to: phoneNumber,
        from: senderID,
        sms: `Your e-tranzact OTP is ${OTP}. Password is valid for 10 minutes.`,
        type: "plain",
        channel: "generic"
    };

    try {
        const response = await axios.post( termiiUrl, smsData, { headers } );

        if(!response)
            throw Error

        const smsResponse = response.data;

        console.log(smsResponse);

        return smsResponse

    } catch(err: any) {
        throw err;
    }
}

export const run = async (req: Request,  res: Response,) => {
    const sms = await sendSMS(req, res, "2347026238705", 123456);
    console.log(sms)
}