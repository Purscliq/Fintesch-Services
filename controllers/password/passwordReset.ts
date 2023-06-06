// IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { User } from '../../models/User'
import { verifyResetEmailAndSendOTP } from './sendPasswordResetOTP'
import { decodeToken } from '../../middlewares/decodeToken'

config();

// verify user email and send list
export class ResetPassword {
    public forgotPassword = async (req:Request, res:Response) => {
        try {
          const { email } = req.body;
          verifyResetEmailAndSendOTP( req, res, email )
        } catch (error: any) {
            console.log(error)
            return res.status(StatusCodes.BAD_REQUEST).json(error.message)
          }
        }

    public changePassword = async (req: Request, res: Response) => {
        try {
          const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
          const email = decodedToken.email
          verifyResetEmailAndSendOTP(req, res, email)
        } catch(error: any) {
          console.log(error)
          return res.status(201).json(error.message)
        }
      }

// Update password in the database
    public resetPassword = async (req:Request, res:Response) => {
        const { OTP, newPassword, confirmPassword } = req.body;
        const user: any = await User.findOne( { OTP } );

        try {
            if (!OTP || OTP !== user.OTP) {
                throw new Error ("A valid one-time password is needed")
            }
            if (newPassword !== confirmPassword) {
                throw new Error("Passwords must match")
            }
            
            const verifyPassword = await bcrypt.compare(newPassword, user.password)

            if (verifyPassword) {
                throw new Error ("You cannot use an old password")
            }

            const securePass = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));
            const updatedUser = await User.findOneAndUpdate({ OTP }, { password: securePass }, 
                { new: true, runValidators: true }).select("firstName lastName email password")

            console.log("Your password has been successfully changed")
            return res.status(201).json({
                message: "Your Password has been successfully changed",
                updatedUser
            });
        } catch(err: any) {
            console.log(err)
            return res.status(201).json(err.message)
        }
    }
}