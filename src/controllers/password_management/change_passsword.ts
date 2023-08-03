import { StatusCodes } from 'http-status-codes';
import { User } from '../../models/User';
import { Request, Response } from 'express';


export class ChangePassword {
    public async update(req: Request, res: Response) {
        try {
            const newPassword = await User.findOneAndUpdate(
                {
                    _id: req.params.id
                }, 
                req.body, 
                { 
                    new: true, 
                    runValidators: true
                }
            )
    
            if(!newPassword) return res.status(StatusCodes.BAD_REQUEST).json({ Error: "Invalid Request" })
    
            return res.status(StatusCodes.OK).json(
                {
                    message: 'Successful',
                    data: newPassword
                } 
            )
        } catch(e: any) {
            console.error(e);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: e.message });
        }
    }
}