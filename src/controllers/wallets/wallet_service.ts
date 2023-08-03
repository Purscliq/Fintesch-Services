import { Request, Response } from "express";
import { TransactionPin } from "./operations/manage_wallet_Pin";
import { FundWalletService } from "../transactions/cards/card_fund_wallet";
import { Balance } from "./operations/manage_wallet_balance";
import { Wallets } from "./create_wallet";

export class WalletService {
    private transactionPin: TransactionPin;
    private fundWallet: FundWalletService;
    private balance: Balance;
    private wallet: Wallets;

    constructor() {
        this.transactionPin = new TransactionPin;
        this.fundWallet = new FundWalletService;
        this.balance = new Balance;
        this.wallet = new Wallets;
    }

    createWallet = (req: Request, res: Response) => this.wallet.createWallet(req, res);

    fund = (req: Request, res: Response) => this.fundWallet.fundWallet(req, res);

    checkBalance = (req: Request, res: Response) => this.balance.getWalletBalance(req, res);

    updateBalance = (req: Request, res: Response) => this.balance.updateBalance(req, res);

    setPin = (req: Request, res: Response) => this.transactionPin.setPin(req, res);

    changePin = (req: Request, res: Response) => this.transactionPin.changePin(req, res);
}