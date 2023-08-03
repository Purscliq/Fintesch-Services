"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const manage_wallet_Pin_1 = require("./operations/manage_wallet_Pin");
const card_fund_wallet_1 = require("../transactions/cards/card_fund_wallet");
const manage_wallet_balance_1 = require("./operations/manage_wallet_balance");
const create_wallet_1 = require("./create_wallet");
class WalletService {
    constructor() {
        this.createWallet = (req, res) => this.wallet.createWallet(req, res);
        this.fund = (req, res) => this.fundWallet.fundWallet(req, res);
        this.checkBalance = (req, res) => this.balance.getWalletBalance(req, res);
        this.updateBalance = (req, res) => this.balance.updateBalance(req, res);
        this.setPin = (req, res) => this.transactionPin.setPin(req, res);
        this.changePin = (req, res) => this.transactionPin.changePin(req, res);
        this.transactionPin = new manage_wallet_Pin_1.TransactionPin;
        this.fundWallet = new card_fund_wallet_1.FundWalletService;
        this.balance = new manage_wallet_balance_1.Balance;
        this.wallet = new create_wallet_1.Wallets;
    }
}
exports.WalletService = WalletService;
