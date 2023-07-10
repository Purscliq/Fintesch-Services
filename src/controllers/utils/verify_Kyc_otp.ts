import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { KYC } from '../../models/KYC'

// verify OTP
export const verifyKycOTP = async (req: Request, res: Response) => {
    try {
        const { OTP } = req.body;
        const kyc = await KYC.findOne({ OTP }).select("OTP")

        if(!kyc) {
           return res.status(StatusCodes.NOT_FOUND).json({ message: 'Please enter a valid one-time Password'})
        }
        kyc.status = true
        kyc.OTP = undefined
        await kyc.save()
        return res.status(StatusCodes.OK).json({ Success: "You have been verified! An account will be created!", Status: kyc.verified })
    } catch( err: any ) {
        console.log(err)
        res.status(StatusCodes.BAD_REQUEST).json( { error: err.message } )
    }
}