import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken';

config();

export class Token {
    private secret: string;

    constructor() {
        this.secret = process.env.token_secret as string;
    }

    public create = ( email: string, userId: any, role: string, status: boolean ) => {
        const payload = { email, userId, role, status } as JwtPayload;
        
        try {
            if( !this.secret ) throw new Error('Token key is undefined');
                
            return jwt.sign(payload, this.secret, { expiresIn: "1d"});

        } catch (error: any) {
            console.error(error);
         } 
    }

    public decode = (token: string) => {
        try {
            if( !this.secret ) throw new Error("Cannot access token key");
            
            const tokenPayload = jwt.verify( token, this.secret ) as JwtPayload;
    
            if( !tokenPayload ) throw new Error("Token could not be decoded.");

            return tokenPayload;
    
        } catch (error: any) {
           console.error(error)
        }   
    }
}