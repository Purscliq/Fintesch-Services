import { TransactionPIN } from "./operations/manage_wallet_Pin.ts"
import { FundWalletService } from "../transactions/cards/card_fund_wallet"
import { Request, Response } from "express"

export class Wallets {
    private transactionPin: TransactionPIN 
    private fundWallet: FundWalletService

    constructor() {
        this.transactionPin = new TransactionPIN
        this.fundWallet = new FundWalletService
    }

    fund(req: Request, res: Response){
        return this.fundWallet.fundWallet(req, res)
    };

    checkBalance() {

    }

    setPin(req: Request, res: Response) {
        return this.transactionPin.setPin(req, res)
    }

    changePin(req: Request, res: Response) {
        return this.transactionPin.changePin(req, res)
    }

}