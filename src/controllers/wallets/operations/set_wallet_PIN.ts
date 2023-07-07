import { Request, Response } from "express";
import { decodeToken } from "../../utils/decodeToken";
import { Wallet } from "../../../models/Wallet";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const setTransactionPIN = async (req: Request, res: Response) => {
  try {
    const { PIN } = req.body;
    const authHeader = req.headers.authorization as string;
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;

    // save PIN to database
    const wallet = await Wallet.findOne({ user: userPayload.userId }).select(
      "PIN"
    );
    if (!wallet)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send("Your account could not be retrieved");
    wallet.PIN = Number(PIN);
    await wallet.save();
    return res.status(StatusCodes.OK).json({
      Success: "PIN has been successfully set",
      PIN: wallet.PIN,
    });
  } catch (error: any) {
    throw error;
  }
};

export const changeTransactionPIN = async (req: Request, res: Response) => {
  try {
    const { newPIN } = req.body;
    const authHeader = req.headers.authorization as string;
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;

    // save PIN to database
    const wallet = await Wallet.findOneAndUpdate(
      { user: userPayload.userId },
      { PIN: Number(newPIN) },
      {
        new: true,
        runValidators: true,
      }
    ).select("PIN");

    if (!wallet)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send("Your account could not be retrieved");

    return res.status(StatusCodes.OK).json({
      Success: "PIN has been successfully set",
      PIN: wallet.PIN,
    });
  } catch (error: any) {
    throw error;
  }
};
