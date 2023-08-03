import {Router }from 'express';
import { FundWalletService } from '../../controllers/transactions/cards/card_fund_wallet';
import { SendMoneyService } from '../../controllers/transactions/transfers/send_money';

export class TransactionsRoute {
    private router: Router;
    private fund: FundWalletService;
    private send: SendMoneyService;

    constructor() {
        this.router = Router();
        this.fund = new FundWalletService;
        this.send = new SendMoneyService;
        this.instantiate();
    }

    public instantiate = () => {
        this.router.route("/fund").post(this.fund.fundWallet);
        this.router.route("/transfer").get(this.send.getBankList);
        this.router.route("/transfer/validate").post(this.send.accountNameValidation);
        this.router.route("/transfer/send").post(this.send.sendMoney);

        return this.router;
    }
}

