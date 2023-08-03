import { Router } from 'express';
import { WalletService } from '../../controllers/wallets/wallet_service';
import { VerifySmsToken } from '../../controllers/wallets/utils/verify_sms_token';

export class WalletRoutes {
    private router: Router;
    private wallet: WalletService;

    constructor() {
        this.router = Router();
        this.wallet = new WalletService;
        this.instantiate();
    };

    public instantiate = () => {
        this.router.route("/").patch(VerifySmsToken.verify);
        this.router.route("/").post(this.wallet.createWallet);
        this.router.route("/balance").get(this.wallet.checkBalance);
        this.router.route("/pin").put(this.wallet.setPin);
        this.router.route("/change_pin").put(this.wallet.changePin);

        return this.router;
    }
};