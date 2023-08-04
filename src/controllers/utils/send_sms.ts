import { config } from 'dotenv';
import axios from 'axios';

config();

export class SendSMS {
    private termiKey: string;
    private termiBaseUrl: string;
    private headers = {
        'Content-Type': ['application/json', 'application/json']
      };

    constructor() {
        this.termiKey = process.env.termiKey as string;
        this.termiBaseUrl = process.env.termi_baseUrl as string;
    };

    public getSenderId = async () => {
        const url = `${this.termiBaseUrl}/sender-id?api_key=${this.termiKey}`
    
        const response = await axios.get(url, { headers: this.headers });
        const result = response.data;
        const senderID = result.data[0].sender_id;
        return senderID;
    }
    
   public sendOtp = async (phoneNumber: string, OTP: Number) => {
        const termiiUrl = `${this.termiBaseUrl}/sms/send`;
    
        const senderID = await new SendSMS().getSenderId();
    
        const smsData = {
            api_key: this.termiKey,
            to: phoneNumber,
            from: senderID,
            sms: `Your e-tranzact OTP is ${OTP}. Password is valid for 10 minutes.`,
            type: "plain",
            channel: "generic"
        };
    
        try {
            const response = await axios.post( termiiUrl, smsData, { headers: this.headers } );
    
            if(!response) throw new Error;
    
            const smsResponse = response.data;
            return smsResponse
    
        } catch(err: any) {
            console.error(err);
        }
    }

    // write a resend sms otp method here
}