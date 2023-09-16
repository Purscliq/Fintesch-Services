import { config } from 'dotenv';
import { GenerateOTP } from '../../utils/generate_otp';
import { User } from '../../../models/User';
import { SendMail } from '../../utils/send_mail';

config();

export class VerifyResetEmailAndSendOtp {
    private domain: string;
    private key: string;
    private OTP: number;
    private mailText: string;

    constructor() {
        this.domain =  process.env.DOMAIN as string;
        this.key = process.env.api_key as string;
        this.OTP = new GenerateOTP().instantiate();
        this.mailText = `<p> You requested to reset your password. Here's your One-time Password: 
        ${this.OTP}. If this isn't you, kindly ignore this mail.</p>`;
    }
    
    public verifyAndSend = async (email: string) => {
        const user = await User.findOne({ email });
            
        try {
            if(!user) throw new Error("Error occured: Could not send OTP");

            user.OTP = this.OTP;
            await user.save();

            const messageData = {
                from: 'e-Tranzact<jon@gmail.com>',
                to: email,
                subject: 'PASSWORD RESET',
                html: this.mailText
            };
            
           SendMail.send(this.domain, this.key, messageData);
        } catch (error: any) {
            console.error(error);
        }
    }
}
