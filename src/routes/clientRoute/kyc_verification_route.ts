import { Router} from 'express';
import { KnowYourCustomer } from '../../controllers/wallets/utils/kyc';

export class KycRoute {
    private router: Router;
    private kyc: KnowYourCustomer;

    constructor() {
        this.router = Router();
        this.kyc = new KnowYourCustomer;
        this.instantiate();
    }

    public instantiate = () => {
        this.router.route("/").post(this.kyc.verifyBvn);

        return this.router;
    }
}