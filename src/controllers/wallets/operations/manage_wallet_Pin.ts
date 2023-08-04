import { Request, Response } from "express";
import { Token } from '../../users/utils/token_service';
import { Wallet } from "../../../models/Wallet";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export class TransactionPin {
  private token: Token;

  constructor() {
    this.token = new Token;
  }

  public setPin = async (req: Request, res: Response) => {
    const { PIN } = req.body;
    const authHeader = req.headers.authorization as string;
    const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

    try {
      const wallet = await Wallet.findOne({ user: userPayload.userId }).select("PIN");

      if (!wallet) return res.status(StatusCodes.BAD_REQUEST).json(
            { 
                message: "Bad Request: account could not be retrieved"
            }
        );

      wallet.PIN = Number(PIN);
      await wallet.save();

      return res.status(StatusCodes.OK).json(
          {
            Success: "PIN has been successfully set!"
          }
      );
    } catch (error: any) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
      }
  };

  public changePin = async (req: Request, res: Response) => {
    try {
      const { newPIN } = req.body;
      const authHeader = req.headers.authorization as string;
      const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

      const wallet = await Wallet.findOneAndUpdate(
        { user: userPayload.userId },
        { PIN: Number(newPIN) },
        {
          new: true,
          runValidators: true,
        }
      ).select("PIN");

      if (!wallet) return res.status(StatusCodes.BAD_REQUEST).json(
            { 
                message: "Bad Request: account could not be retrieved" 
            }
        );

      return res.status(StatusCodes.OK).json(
        {
            Success: "PIN has been successfully changed",
            PIN: wallet.PIN
        }
      );
    } catch (error: any) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  };
}
