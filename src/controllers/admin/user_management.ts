import { StatusCodes } from "http-status-codes"
import { User } from "../../models/User"
import { Request, Response } from 'express'

export const viewAllUsers = async ( req: Request, res: Response ) => {
    try {
        const user = await User.find()
        if(!user) return res.status(StatusCodes.NOT_FOUND).send("Could not retrieve any user")
        return res.status(StatusCodes.OK).json({ user, numOfUsers: user.length })
    } catch (err: any) {
        console.error(err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}

export const viewSpecificUser = async ( req: Request, res: Response ) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if(!user) return res.status(StatusCodes.NOT_FOUND).send("Could not retrieve any user")
       return res.status(StatusCodes.OK).json(user);
    } catch (err: any) {
        console.error(err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
    }
}