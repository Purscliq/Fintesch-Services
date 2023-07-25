import { Router } from 'express';
import { Balance } from '../../controllers/wallets/operations/manage_wallet_balance';
import { TransactionPIN } from '../../controllers/wallets/operations/manage_wallet_Pin';
import { WalletService } from '../../controllers/wallets/create_wallet';

export class WalletRoutes {
    private router: Router;
    private wallet: WalletService;
    private balance: Balance;
    private managePin: TransactionPIN;


    constructor() {
        this.router = Router();
        this.wallet = new WalletService();
        this.balance = new Balance();
        this.managePin = new TransactionPIN();
    }

    public instantiate() {
        this.router.route("/").post(this.wallet.createWallet);
        this.router.route("/balance").get(this.balance.getWalletBalance);
        this.router.route("/pin").put(this.managePin.setPin);
        this.router.route("/change_pin").put(this.managePin.changePin);

        return this.router;
    }
}