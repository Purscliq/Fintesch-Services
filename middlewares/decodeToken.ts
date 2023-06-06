import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
const { jwtKey } = process.env

config()

export const decodeToken = ( token: string ) => {
    try {
        if(!jwtKey) {
            throw new Error("Cannot access secret Key")
		}

        const decodedToken = jwt.verify( token, jwtKey) as JwtPayload

        if(!decodedToken) {
            throw new Error("Token could not be decoded.")
		}
        return decodedToken
    } catch (error:any) {
       console.error(error)
    }   
}