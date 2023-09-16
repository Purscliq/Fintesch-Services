import { config } from 'dotenv';
import { Request, Response } from 'express';
import { User } from '../../models/User';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { GenerateOTP } from '../utils/generate_otp';
import { SendMail } from '../utils/send_mail';
import { Token } from './utils/token_service';
import cron from 'node-cron';
import bcrypt from 'bcrypt';

config();

export class Auth {
    private domain: string;
    private key: string;
    private token: Token;
    private OTP: number;
    private text: string;

    constructor() {
        this.domain = <string>process.env.DOMAIN;
        this.key = <string>process.env.mailgun_key; 
        this.OTP = new GenerateOTP().instantiate();
        this.text =`<p> Welcome to e-Tranzact. Your One-Time password for your e-Tranzact account is ${this.OTP}. Password is valid for 20 minutes.</p>`;
        this.token = new Token;
    }

    public signup = async (req: Request, res: Response) => {        
        try {
            const { email, password, confirmPassword } = req.body;
            const checksIfUserExists = await User.findOne({ email }).select("email");
            
            if(checksIfUserExists) return res.status(StatusCodes.BAD_REQUEST).json('This user already exists.');
            
            if(password !== confirmPassword) return res.status(StatusCodes.UNAUTHORIZED).json('Password must match');

            const securePassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

            const user = new User ({ 
                    email, 
                    password: securePassword 
                });

            user.OTP = this.OTP;

            await user.save();
            
            const messageData = {
                from: 'e-Tranzact <jon@gmail.com>',
                to: email,
                subject: 'Verify Your Account',
                html: this.text
            };

           SendMail.send(this.domain, this.key, messageData);

            const noOfUsers = await User.countDocuments({});

            if( noOfUsers === 0 ) {
                user.role = "Admin";
                await user.save();
            };

            return res.status(StatusCodes.OK).json(
                { 
                    Success: "User profile created successfully! A One-Time Password has been sent to your mail"
                }
            );
        } catch (error: any) {
            console.error(error.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }

    public signin = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const profile = await User.findOne({ email }).select("email password");
            
            if (!profile) 
                return res.status(StatusCodes.NOT_FOUND).json(
                    { 
                        message: "This user is " + ReasonPhrases.NOT_FOUND 
                    }
                );
           
            const isPasswordMatch = await bcrypt.compare(password, profile.password);

            if (!isPasswordMatch) return res.status(StatusCodes.UNAUTHORIZED).json(
                { 
                    message: "The password you entered is incorrect"
                }
            );

            const token = this.token.create(
                profile.email,
                profile._id,
                profile.role,
                profile.isVerified
            );

            return res.status(StatusCodes.OK).json(
                { 
                    token, 
                    profile 
                }
            );
            
        } catch ( error: any ) {
            console.error(error) 
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        }
    };

    public signout = async (req: Request, res: Response) => {
        try {
                return req.headers.authorization = undefined;
            } catch (error) {
                console.error(error)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
            }
        }
    }