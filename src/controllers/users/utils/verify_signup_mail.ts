// IMPORT DEPENDENCIES
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { User } from '../../../models/User'

export class VerifySignupMail {
    public static async verify (req: Request, res: Response) {
        const { OTP } = req.body;
        const user = await User.findOne({ OTP }).select("OTP");

        try {
            if(!user) return res.status(StatusCodes.NOT_FOUND).json(
                { 
                    message: 'Please enter a valid one-time Password'
                }
            );

            user.status = true;
            user.OTP = undefined;

            await user.save();
            
            return res.status(StatusCodes.OK).json(
                { 
                    Success: "You have been verified! Happy Tranzacting!",
                    Status: user.verified 
                }
            );
         } catch(err: any) {
            console.log(err);
            res.status(StatusCodes.BAD_REQUEST).json( 
                { 
                    error: err.message 
                } 
            );
         }
    }
}