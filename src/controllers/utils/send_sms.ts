// IMPORT DEPENDENCIES
import { config } from 'dotenv';
import axios from 'axios';

config();

const termiKey = process.env.termiKey as string;

const headers = {
    'Content-Type': 'application/json'
  }

// Function to send OTP via SMS 
export const sendSMS = async( phoneNumber: string, OTP: Number) => {
    const termiiUrl = "https://api.ng.termii.com/api/sms/send";

    const smsData = {
        api_key: termiKey,
        to: phoneNumber,
        from: "e-Tranzact",
        sms: `Your e-tranzact OTP is ${OTP}. Password is valid for 10 minutes.`,
        type: "plain",
        channel: "generic"
    };

    try {
        const response = await axios.post( termiiUrl, smsData, { headers } );

        const smsResponse = response.data;

        console.log(smsResponse);

        return smsResponse;
    } catch(err: any) {
        throw err;
    }
}