import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Token } from '../src/controllers/users/utils/token_service';
import { JwtPayload } from 'jsonwebtoken';

export class CheckRole {
    private role: string;

    constructor(role: string) {
        this.role = role;
    }

   public check(req: Request, res: Response, next: NextFunction) {
        try {
              const authHeader = req.headers.authorization as string;
              const user = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;
              
              user.role === this.role ? next() : res.status(StatusCodes.FORBIDDEN).json(
                  { 
                    message: `${(this.role).toUpperCase} ONLY! You are not authorized to perform this action.` 
                  }
              );
          } catch(error: any) {
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

