import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken';

config();

export class Token {
    private secretKey = process.env.secretKey as string;

    public createToken = ( email: string, userId: any, role: string ) => {

        const payload = { email, userId, role } as JwtPayload;

        if( !this.secretKey ) throw new Error('Token key is undefined');
            
        return jwt.sign(payload, this.secretKey, { expiresIn: "1d"});
    }
}