import { Request, Response } from "express"
import { JwtPayload } from "jsonwebtoken"
import { decodeToken } from "./decode_token"
import { generateOTP } from "./generate_otp"
import { User } from "../../models/User"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { sendMail } from "./send_mail"
import { config } from "dotenv"

config()

const domain = process.env.DOMAIN as string
const key = process.env.api_key as string

export const resendOTP = async(req:Request, res:Response) => {
    try {
        const data = decodeToken(req.cookies.jwt) as JwtPayload
        const user = await User.findOne({ email: data.email })

        if(!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND })
        }

        user.OTP = generateOTP()
        await user.save()

        // resend OTP to user Mail
        const mailText = `<p>Your One-Time password for your e-Tranzact account is ${user.OTP}.
        Password expires in 10 minutes</p>`
        
        const messageData = {
            from: 'e-Tranzact <jon@gmail.com>',
            to: data.email,
            subject: 'One-Time Password',
            html: mailText
        }
        sendMail(domain, key, messageData)
        return res.status(StatusCodes.OK).json( {message: "A One-Time password has been sent to your mail", newCode: user.OTP})
    } catch (err: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
    }
}