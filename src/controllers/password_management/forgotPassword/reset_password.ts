import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../../../models/User";
import bcrypt from 'bcrypt';


export class ResetPassword {
    public static async reset(req: Request, res: Response) {
        const id = req.params.id;
        const { newPassword, confirmNewPassword } = req.body;

        try {
            if(newPassword !== confirmNewPassword) return res.status(StatusCodes.UNAUTHORIZED).json(
                { 
                    Error: "Passwords must match" 
                }
            );

            const user = await User.findOne({ _id: id });

            if(!user) return res.status(StatusCodes.BAD_REQUEST).json(
                { 
                    Error: "Bad Request: Request could not be completed" 
                }
            );
            
            const verifyPassword = await bcrypt.compare(newPassword, user.password);

            if(verifyPassword) return res.status(StatusCodes.BAD_REQUEST).json("You cannot use an old password");

            const securePass = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

            const updatedPass = await User.findOneAndUpdate(
                    { _id: id }, 
                    { password: securePass }, 
                    { new: true, runValidators: true }
                );

            return res.status(StatusCodes.OK).json(
                {
                    message: "Your Password has been successfully changed",
                    updatedPass
                }
            );

        } catch (error: any) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    };
}