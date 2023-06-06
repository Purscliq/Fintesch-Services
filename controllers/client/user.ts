//IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { User } from "../../models/User"
import { createToken } from "../auth"
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
const expires =  process.env.expires as string 
const jwtLife = parseInt(expires)

config();

// GET YOUR PROFILE
export const viewMyProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const myProfile = await User.findOne({ _id: id })
            .select("firstName lastName, email")

        return res.status(StatusCodes.OK)
            .json({ message: "Retrieving Account details", myProfile });
    } catch(error: any) {
        console.error(error) 
        res.status(StatusCodes.UNAUTHORIZED).json(error.message)
    }
}

// EDIT ACCOUNT DETAILS
export const editMyProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const updatedProfile = await User.findOneAndUpdate( { _id: id }, req.body, { 
            new: true, 
            runValidators: true
        }).select("firstName lastName, email")
        if(!updatedProfile) {
            console.log("Error occurred. Cannot Update profile")
            return res.send("Error occurred: cannot update profile")
        }
        // Create new token that contains updated data
        const token = createToken( updatedProfile.email, updatedProfile._id );

        return res.cookie("jwt", token, { httpOnly: true, maxAge: jwtLife })
            .status(StatusCodes.OK).json({ id: updatedProfile._id, userName: updatedProfile.userName, email: updatedProfile.email })
    } catch (error: any) {
            console.error(error)
            res.status(400).json(error.message) 
        }
    }

// DELETE USER ACCOUNT
export const deleteMyProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        await User.findOneAndDelete( { _id: id });
        return res.status(200).json({ Success: "Your account has been deleted" })
    } catch (error: any) {
        console.error(error)
        res.status(400)
            .json(error.message)
    }
}

// USER SIGNOUT METHOD
export const signOut = async (req:Request, res:Response) => {
    try {
        return res.cookie("jwt", "", { maxAge: 1 }).status(StatusCodes.OK).json({
            message: "You have been successfully Logged Out"
        })
    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
    }
}