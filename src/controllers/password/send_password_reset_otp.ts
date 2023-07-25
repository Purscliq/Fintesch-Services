// IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { GenerateOTP } from '../utils/generate_otp'
import { StatusCodes } from 'http-status-codes'
import { User } from '../../models/User'
import { sendMail } from '../utils/send_mail'

config();


export class VerifyResetEmailAndSendOtp {
    private domain: string;
    private key: string;
    private OTP: GenerateOTP;
    private mailText: string;

    constructor() {
        this.domain =  process.env.DOMAIN as string;
        this.key = process.env.api_key as string;
        this.OTP = new GenerateOTP;
        this.mailText = `<h3> You requested to reset your password. Here's your One-tsime Password: 
        ${this.OTP}. If this isn't you, kindly ignore this mail./p>`;
    }
    
    public async verifyAndSend( req: Request, res:Response, email: string ) {
        try {

            const user = await User.findOne({ email })
            
            if(!user)
                return res.status(StatusCodes.NOT_FOUND).send("USER NOT FOUND")

            user.OTP = this.OTP;
            await user.save();

            const messageData = {
                from: 'e-Tranzact<jon@gmail.com>',
                to: email,
                subject: 'PASSWORD RESET',
                html: this.mailText
            };
            
            await sendMail(this.domain, this.key, messageData)
        } catch (error: any) {
            console.error(error);
            return res.status(StatusCodes.BAD_REQUEST).send("Error occured: Could not send OTP")
        }
    }
}
