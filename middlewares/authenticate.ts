import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

config();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.secretKey;
    const authHeader = req.headers.authorization as string;
    const token = authHeader.split(" ")[1];

    try {
        if(!secret) return res.status(StatusCodes.UNAUTHORIZED).json("Provide secret authentication key.");

        if(!token) return res.status(StatusCodes.UNAUTHORIZED).json("Authentication token not detected");
        
       const decodedToken = jwt.verify(token, secret) as JwtPayload;
       
        if(!decodedToken) return res.status(StatusCodes.UNAUTHORIZED).json("Token verification failed!");

        return next();
    } 
    catch( err: any ) {
        console.error(err);
    }
}