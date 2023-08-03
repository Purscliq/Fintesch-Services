//IMPORT DEPENDENCIES
import { config } from 'dotenv';
import { Request, Response } from 'express';
import { User } from "../../models/User";
import { Token } from './utils/token_service';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';

config();

export class Profile {
    private token: Token;

    constructor() {
        this.token = new Token;
    }

    public viewProfile = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization as string;
            const data = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

            const myProfile = await User.findOne(
                { 
                    _id: data.userId 
                }
            );

            return res.status(StatusCodes.OK).json(myProfile);  

        } catch(error: any) {
            console.error(error);
            return res.status(StatusCodes.UNAUTHORIZED).json(error.message);
        }
    }

    public updateProfile = async (req: Request, res: Response) =>{
        try {
            const authHeader = req.headers.authorization as string;
            const data = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;
            
            const updatedProfile = await User.findOneAndUpdate({ _id: data.userId }, req.body,
                { 
                    new: true, 
                    runValidators: true
                }
            );

            if(!updatedProfile) return res.send("Error occurred: cannot update profile");

            const token = this.token.create(
                    updatedProfile.email, 
                    updatedProfile._id, 
                    updatedProfile.role,
                    updatedProfile.isVerified
                );

            return res.status(StatusCodes.OK).json({ token, updatedProfile });

        } catch (error: any) {
            console.error(error);
            return res.status(400).json(error.message);
        }
    }


    public deleteProfile = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization as string;
            const data = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

            await User.findOneAndDelete({ _id: data.userId });

            return res.status(200).json({ 
                Success: "Your account has been deleted" 
            });

        } catch (error: any) {
            console.error(error);
            return res.status(400).json(error.message);
        }
    }
}