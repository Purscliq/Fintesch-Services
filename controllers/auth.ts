//IMPORT DEPENDENCIES
import { config } from 'dotenv' 
import {Request, Response} from 'express'
import {StatusCodes, ReasonPhrases} from 'http-status-codes'
import jwt, {JwtPayload} from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models/User'
import { generateOTP } from './utils/generateOTP'
import { sendMail } from './utils/sendMail'

config();

const jwtKey = process.env.jwtKey as string
const expires =  process.env.expires as string 
const jwtLife = parseInt(expires)
const domain = process.env.DOMAIN as string
const key = process.env.api_key as string

// TOKEN CREATION FUNCTION
export const createToken = ( email:string, userId:any ) => {
    const payload = { email, userId } as JwtPayload
    if(!jwtKey){
        throw new Error(' token key is undefined')
    }
    return jwt.sign( payload, jwtKey, { expiresIn: jwtLife })
}

// AUTHENTICATE CLASS
export class Authenticate {
    public signUp = async (req: Request, res: Response ) => {
        try {
            const { email, password, confirmPassword } = req.body
            const userCount = await User.countDocuments({})
            const checksIfUserExists = await User.findOne({ email })
            
            if(checksIfUserExists) {
                return res.status(StatusCodes.BAD_REQUEST).send('This user already exists.')
            } 
            if(password !== confirmPassword) {
                return res.status(StatusCodes.UNAUTHORIZED).send('Password must match')
            }
            const securePassword = await bcrypt.hash(password, bcrypt.genSaltSync(10))
            const user = new User({ email, password: securePassword })

            if(userCount === 0) {
                user.role = "Admin"
            }
            user.OTP = generateOTP()
            const expiry = Date.now() + 2000
            await user.save()

            // Send OTP to Mail
            const mailText = `<p> Welcome to e-Tranzact. Your One-Time password for your e-Tranzact account is ${user.OTP}.
            Password is valid for 20 minutes.</p>`
            
            const messageData = {
                from: 'e-Tranzact <jon@gmail.com>',
                to: email,
                subject: 'Verify Your Account',
                html: mailText
            }
            sendMail(domain, key, messageData)

            return res.status(StatusCodes.OK).json({ 
                Success: "USER PROFILE CREATED SUCCESSFULLY!", 
                message: "A One-Time Password has been sent to your mail",
                OTP: user.OTP
            })
        } catch (error: any) {
            console.error(error.message)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

// GOOGLE AUTH REGISTRATION



// USER LOGIN METHOD
    public signIn = async ( req:Request, res:Response) => {
        try {
            const { email, password } = req.body
            const profile = await User.findOne({ email })

            if (!profile) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "This user is " + ReasonPhrases.NOT_FOUND })
            }
           
            const isPasswordMatch = await bcrypt.compare( password, profile.password )

            if ( !isPasswordMatch) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "The password you entered is incorrect" })
            }

            const token = createToken(profile.email, profile._id)
            console.log("Login successful!")
            res.cookie("jwt", token, { httpOnly: true, domain: "127.0.0.1", maxAge: jwtLife })
                .status(StatusCodes.OK).json({ Success: "Login Successful", profile })
        } catch( error: any ) {
            console.error(error) 
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}