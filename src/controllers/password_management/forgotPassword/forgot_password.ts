import { config } from 'dotenv'
import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { User } from '../../../models/User' 
import { VerifyResetEmailAndSendOtp } from './verify_send_password_reset_otp'

config();

export class ForgotPassword {
    public getResetOtp = async (req: Request, res: Response) => {
        try {
          const { email } = req.body;
          await new VerifyResetEmailAndSendOtp().verifyAndSend(email);
        } catch (error: any) {
            console.error(error);
            return res.status(StatusCodes.BAD_REQUEST).json(error.message);
          }
        };

        
    //  Incomplete.
    public resendResetOtp = async (email: string) => {
        try {
            await new VerifyResetEmailAndSendOtp().verifyAndSend(email);
          } catch (error: any) {
              console.error(error);
              throw (error.message);
            }
        };

  
    public verifyResetOtp = async (req: Request, res: Response) => {
        const { OTP } = req.body;
        const user: any = await User.findOne({ OTP }).select('OTP');

        try {
            if(!OTP || OTP !== user.OTP) 
                return res.status(StatusCodes.BAD_REQUEST).json(
                    { 
                        error: "A valid One-time password is needed" 
                    }
                );

            return res.status(StatusCodes.OK).redirect(StatusCodes.PERMANENT_REDIRECT, `/password/reset/${user._id}`);
        } catch(error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    };
}