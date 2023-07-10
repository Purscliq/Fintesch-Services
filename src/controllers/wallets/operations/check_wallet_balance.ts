import {config} from 'dotenv'
import { Request, Response } from "express"
import { decodeToken } from "../../utils/decode_token"
import { JwtPayload } from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"
import {Wallet} from "../../../models/Wallet"

export const getWalletBalance = async(req: Request, res: Response) => {
    const authHeader = req.headers.authorization as string
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload
    try {
        const walletBalance = await Wallet.findOne({ user: userPayload.userId }).select("balance")
        res.status(StatusCodes.OK).json(walletBalance)
    } catch(err: any) {
        throw(err)
    }
}