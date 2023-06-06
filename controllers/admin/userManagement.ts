import { User } from "../../models/User"
import { Request, Response } from 'express'

// MANAGE UserS
// VIEW ALL User
export const viewAllUsers = async ( req: Request, res: Response ) => {
    try {
        const user = await User.find()
            .select( "firstName lastName email" )

        if(!user) {
            return res.send("Could not retrieve any User")
        }

        return res.status(200).json({ user, numOfUsers: user.length });
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

// VIEW ONE USER
export const viewUser = async ( req: Request, res: Response ) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select( "firstName lastName email" )

        if(!user) {
            return res.send("Could not retrieve any User")
        }

       return res.status(200).json(user);
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}