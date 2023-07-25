// IMPORT DEPENDENCIES
import { config } from 'dotenv';
import {Request, Response} from 'express';
import { User } from '../../models/User';
import {StatusCodes, ReasonPhrases} from 'http-status-codes';
import bcrypt from 'bcrypt';
import { GenerateOTP } from '../utils/generate_otp';
import { sendMail } from '../utils/send_mail';
import { Token } from '../utils/create_token';

config();


export class AuthService {
    private domain: string;
    private key: string;
    private token: Token;
    private OTP: GenerateOTP;
    private mailText: string;

    constructor() {
        this.domain = process.env.DOMAIN as string;
        this.key = process.env.mailgunKey as string; 
        this.OTP = new GenerateOTP;
        this.mailText =`<p> Welcome to e-Tranzact. Your One-Time password for your e-Tranzact account is ${this.OTP}.
        Password is valid for 20 minutes.</p>`
        this.token = new Token;
    }

    public async signup(req: Request, res: Response) {
        try {
            const { email, password, confirmPassword } = req.body;
            const checksIfUserExists = await User.findOne({ email }).select("email");
            
            if(checksIfUserExists) {
                return res.status(StatusCodes.BAD_REQUEST).send('This user already exists.');
            } 
            
            if(password !== confirmPassword) {
                return res.status(StatusCodes.UNAUTHORIZED).send('Password must match');
            }

            const securePassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

            const user = new User(
                { 
                    email, 
                    password: securePassword 
                }
            );

            user.OTP = this.OTP;
            await user.save();
            
            const messageData = {
                from: 'e-Tranzact <jon@gmail.com>',
                to: email,
                subject: 'Verify Your Account',
                html: this.mailText
            }

            await sendMail(this.domain, this.key, messageData);

            const userCount = await User.countDocuments({});

            if(userCount === 0) {
                user.role = "Admin"
                await user.save();
            }

            return res.status(StatusCodes.OK).json(
                { 
                    Success: "USER PROFILE CREATED SUCCESSFULLY!", 
                    message: "A One-Time Password has been sent to your mail",
                    OTP: user.OTP
                }
            )
        } catch (error: any) {
            console.error(error.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }

    public async signin(req: Request, res: Response) {
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

            if (!isPasswordMatch)
                return res.status(StatusCodes.UNAUTHORIZED).json(
                    { 
                        message: "The password you entered is incorrect" 
                    }
                )

            const token = this.token.createToken(
                profile.email,
                profile._id,
                profile.role
            );

            return res.status(StatusCodes.OK).json(
                { 
                    token, 
                    profile 
                }
            );
            
        } catch( error: any ) {
            console.error(error) 
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
        }
    };

    public async signout(req: Request, res: Response) {
        try {
                return req.headers.authorization = undefined;
            } catch (error) {
                console.error(error)
                return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
            }
        }
    }