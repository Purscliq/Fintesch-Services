// IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { generateOTP } from '../utils/generate_otp'
import { StatusCodes } from 'http-status-codes'
import { User } from '../../models/User'
import { sendMail } from '../utils/send_mail'

config();

// Mailgun message data parameters
const domain = process.env.DOMAIN as string
const key = process.env.api_key as string

// @ Send email
// This function verifies the user's email, creates a reset token and sends an email containing reset link
export const verifyResetEmailAndSendOTP = async ( req: Request, res:Response, email: string ) => {
    try {
         const user = await User.findOne({ email })
         
         if(!user) {
            console.log("USER NOT FOUND")
            return res.status(StatusCodes.NOT_FOUND).send("USER NOT FOUND")
         }

         user.OTP = generateOTP()
         await user.save()

         const messageData = {
             from: 'e-Tranzact<jon@gmail.com>',
             to: email,
             subject: 'PASSWORD RESET',
             html: `<h3> You requested to reset your password. Here's your One-Time Password: 
             ${user.OTP}. If this isn't you, kindly ignore this mail./p>`
         };
         
         sendMail(domain, key, messageData)
    } catch (error: any) {
        console.error(error);
        return res.status(StatusCodes.BAD_REQUEST).send("Error occured: Could not send OTP")
    }
}
