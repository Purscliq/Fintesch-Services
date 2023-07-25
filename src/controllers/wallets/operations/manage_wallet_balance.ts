// import {config} from 'dotenv'
import { Request, Response } from "express"
import { decodeToken } from "../../utils/decode_token"
import { JwtPayload } from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"
import {Wallet} from "../../../models/Wallet"
import { Transaction } from '../../../models/Transaction'
import { VerifyTransactions } from './verify_transactions'



export class Balance {
    private budBaseUrl: string = process.env.budBaseUrl as string;
  

    public async getWalletBalance(req: Request, res: Response) {
        const authHeader = req.headers.authorization as string;
        const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
        try {
            const walletBalance = await Wallet.findOne({ user: userPayload.userId }).select("balance")
            res.status(StatusCodes.OK).json(walletBalance)
        } catch(err: any) {
            throw(err)
        }
    }

    public async updateBalance (req: Request, res: Response) {

        const authHeader = req.headers.authorization as string;
        const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
        const { notify, notifyType, data } = req.body;

        try {
            if (
                  notify === "transaction" && 
                  notifyType === "successful" && 
                  data.type === "dedicated_nuban"
                ) {
                    const url = `${this.budBaseUrl}/v2/transaction/verify/:${data.reference}`
                    const verifyPayin = await new VerifyTransactions().verify(url, data);
                    const wallet: any = await Wallet.findOne(
                        { 
                            user: userPayload.userId 
                        }
                    ).select("balance");

                    wallet.balance = (wallet.balance) + parseInt(verifyPayin.data.amount);
                    wallet.status = verifyPayin.data.status;
                    await wallet.save();

                    const transactionPayload = {
                        user: userPayload.userId,
                        ...data
                    }

                    const transaction = new Transaction( transactionPayload );
                    await transaction.save();

                } else if (notify === "payout" && notifyType === "successful") {
                    const url = `${this.budBaseUrl}/v2/payout/verify/:${data.reference}`;
                    const transaction: any = await Transaction.findOne({ user: userPayload.userId });
                    const verifyPayout = await new VerifyTransactions().verify(url, data);
                    transaction.status = verifyPayout.data.status;
                    await transaction.save();

                    return res.status(StatusCodes.OK).json(
                        { 
                            message: `Transaction ${transaction.status}` 
                        }
                    );
                }
            } catch (error: any) {
                console.log(error)
            }
         }
    }

// data.amount !== result.data.amount &&