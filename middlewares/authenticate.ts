import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
const jwtKey = process.env.jwtKey

config()


// Define an interface to extend the Request type
interface tokenRequest {
    token?: any;
  }


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt
        
        if (!jwtKey) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Provide secret authentication key.")
        }
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Authentication token not detected")
        }
        
       const decodedToken = jwt.verify( token, jwtKey) as JwtPayload
       (req as tokenRequest).token = decodedToken

         if(!decodedToken) {
            return res.status(400).send("Token verification failed!")
         }

        return next();
    } 
    catch(err:any) {
        throw new Error("An error occured with token verification. Authentication failed")
    }
}