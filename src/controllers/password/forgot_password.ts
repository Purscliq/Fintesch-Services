// IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { User } from '../../models/User'
import { VerifyResetEmailAndSendOtp } from './send_password_reset_otp'
import { decodeToken } from '../utils/decode_token'

config();

export class ForgotPassword {

    public async getResetOtp(req: Request, res: Response) {
        try {
          const { email } = req.body;

          await new VerifyResetEmailAndSendOtp().verifyAndSend(req, res, email);

        } catch (error: any) {
            console.log(error);
            return res.status(StatusCodes.BAD_REQUEST).json(error.message);
          }
        } 
  

    public async verifyResetOtp (req: Request, res: Response){
        try {
            const { OTP } = req.body;
            const user: any = await User.findOne({ OTP });

            if (!OTP || OTP !== user.OTP) 
                return res.status(StatusCodes.NOT_FOUND).send("A valid One-time password is needed");

            return res.status(StatusCodes.OK).redirect(StatusCodes.PERMANENT_REDIRECT, `/pwd/reset/${user._id}`);
        } catch(error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    }

    public async updatePassword (req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = await User.findOne({ _id: id });

            const { newPassword, confirmPassword } = req.body;

            if(!user) return res.status(StatusCodes.NOT_FOUND).send("User not found");

            if (newPassword !== confirmPassword) return res.status(StatusCodes.UNAUTHORIZED).send("Passwords must match");
            
            const verifyPassword = await bcrypt.compare(newPassword, user.password);

            if (verifyPassword) return res.status(StatusCodes.BAD_REQUEST).send("You cannot use an old password");

            const securePass = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

            const updatedUser = await User.findOneAndUpdate(
                    { _id: id }, 
                    { password: securePass }, 
                    { new: true, runValidators: true }
                );

            return res.status(StatusCodes.OK).json(
                {
                    message: "Your Password has been successfully changed",
                    updatedUser
                }
            );

        } catch (err: any) {
            console.log(err);
            return res.status(201).json(err.message);
        }
    }
}