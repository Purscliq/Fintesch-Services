import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
const secretKey = process.env.secretKey

config()

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization as string
        const token = authHeader.split(" ")[1]
        if(!secretKey)
            return res.status(StatusCodes.UNAUTHORIZED).send("Provide secret authentication key.")
        if(!token)
            return res.status(StatusCodes.UNAUTHORIZED).send("Authentication token not detected")
        
       const decodedToken = jwt.verify(token, secretKey) as JwtPayload
       
        if(!decodedToken)
            return res.status(StatusCodes.UNAUTHORIZED).send("Token verification failed!")
        return next();
    } 
    catch(err:any) {
        throw Error("An error occured with token verification. Authentication failed")
    }
}