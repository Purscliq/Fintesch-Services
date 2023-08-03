import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Token } from '../src/controllers/users/utils/token_service';
import { JwtPayload } from 'jsonwebtoken';

export class CheckStatus {
    public static isVerified(req: Request, res: Response, next: NextFunction) {
      try {
            const authHeader = req.headers.authorization as string;
            const user = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;
            
            (user.status) ? next() : res.status(StatusCodes.FORBIDDEN).json(
                { 
                  message: "You are not verified yet" 
                }
            );
        } catch (error: any) {
            console.error(error);
            return res.status(error.status).json(
                {
                    error: error.status,
                    message: error.message
                }
            );
        }
    }
}

  