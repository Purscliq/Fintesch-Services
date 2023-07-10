import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { User } from '../src/models/User';
import { JwtPayload } from 'jsonwebtoken';
import { decodeToken } from '../src/controllers/utils/decode_token'

export async function isBusiness(req: Request, res: Response, next: NextFunction) {
  try{
    const decoded = decodeToken(req.cookies.jwt) as JwtPayload;
    const user: any = await User.findOne({ _id: decoded.userId }).select("role");
    // Check if the user making the request is an business
    // If the user is an admin, allow them to proceed to the next middleware function
    if (user.role === "Business") {
      next(); 
    } else {
        return res.status(StatusCodes.FORBIDDEN).json({ 
          message: "ONLY BUSINESSES! You are not authorized to perform this action" 
      });
    } 
  } catch(error: any) {
      console.error(error);
      return res.json({
        error: error.status,
        message: error.message
      });
    }
  }