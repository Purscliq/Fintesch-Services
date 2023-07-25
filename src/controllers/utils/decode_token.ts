import { config } from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

config();
const { secretKey } = process.env;

export const decodeToken = ( token: string ) => {
    try {
        if(!secretKey) {
            throw new Error("Cannot access secret Key");
		}
        
        const decodedToken = jwt.verify( token, secretKey) as JwtPayload;

        if(!decodedToken) {
            throw new Error("Token could not be decoded.");
		}
        return decodedToken;

    } catch (error: any) {
       console.error(error)
    }   
}