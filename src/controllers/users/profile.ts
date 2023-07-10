//IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { User } from "../../models/User"
import { createToken } from "./auth"
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { decodeToken } from '../utils/decode_token'
import { JwtPayload } from 'jsonwebtoken'

config();

// GET YOUR PROFILE
export const viewMyProfile = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization as string
        const data = decodeToken(authHeader.split(" ")[1]) as JwtPayload
        const myProfile = await User.findOne({_id: data.userId})
        console.log(myProfile)
        return res.status(StatusCodes.OK)
            .json(myProfile);
    } catch(error: any) {
        console.error(error) 
        res.status(StatusCodes.UNAUTHORIZED).json(error.message)
    }
}

// EDIT PROFILE DETAILS
export const editMyProfile = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization as string
        const data = decodeToken(authHeader.split(" ")[1]) as JwtPayload
        const updatedProfile = await User.findOneAndUpdate( { _id: data.userId }, req.body, { 
            new: true, 
            runValidators: true
        })

        if(!updatedProfile) {
            return res.send("Error occurred: cannot update profile")
        }
        // Create new token that contains updated data
        const token = createToken( updatedProfile.email, updatedProfile._id );
        return res.status(StatusCodes.OK).json({ token, updatedProfile })
    } catch (error: any) {
            console.error(error)
            res.status(400).json(error.message) 
        }
    }

// DELETE USER ACCOUNT
export const deleteMyProfile = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization as string
        const data = decodeToken(authHeader.split(" ") [1]) as JwtPayload
        await User.findOneAndDelete({ _id: data.userId  })
        return res.status(200).json({ Success: "Your account has been deleted" })
    } catch (error: any) {
        console.error(error)
        res.status(400)
            .json(error.message)
    }
}

// USER SIGNOUT METHOD
// export const signOut = async (req:Request, res:Response) => {
//     try {
//         return res.cookie("jwt", "", { maxAge: 1 }).status(StatusCodes.OK).json({
//             message: "You have been successfully Logged Out"
//         })
//     } catch (error) {
//         console.error(error)
//         return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
//     }
// }