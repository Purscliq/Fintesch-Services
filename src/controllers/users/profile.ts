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
            const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

            if (!userPayload.userId) return res.status(StatusCodes.UNAUTHORIZED).json("Unauthorized");

            const myProfile = await User.findOne(
                { 
                    _id: userPayload.userId 
                }
            );

            return res.status(StatusCodes.OK).json(myProfile);  

        } catch(error: any) {
            console.error(error);
            return res.status(StatusCodes.UNAUTHORIZED).json(error.message);
        }
    }

    public updateProfile = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization as string;
            const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

            if (!userPayload.userId) return res.status(StatusCodes.UNAUTHORIZED).json("Unauthorized");
            
            const updatedProfile = await User.findOneAndUpdate({ _id: userPayload.userId }, req.body,
                { 
                    new: true, 
                    runValidators: true
                }
            );

            if(!updatedProfile) return res.status(StatusCodes.BAD_REQUEST).json("error occurred: could not update profile");

            const token = this.token.create(
                    updatedProfile.email, 
                    updatedProfile._id, 
                    updatedProfile.role,
                    updatedProfile.isVerified
                );

            return res.status(StatusCodes.OK).json({ token, updatedProfile });

        } catch (error: any) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }


    public deleteProfile = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization as string;
            const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

            if (!userPayload.userId) return res.status(StatusCodes.UNAUTHORIZED).json("Unauthorized");

            await User.findOneAndDelete({ _id: userPayload.userId });

            return res.status(StatusCodes.OK).json({ 
                Success: "Your account has been deleted succesfully" 
            });

        } catch (error: any) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }
}