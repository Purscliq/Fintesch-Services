import { Router } from 'express';
import { TopUpService } from '../../controllers/transactions/quick-services/top-up';

export class QuickServicesRoute {
    private router: Router;
    private topup: TopUpService;

    constructor() {
        this.router = Router();
        this.topup = new TopUpService;
        this.instantiate();
    };

    public instantiate = () => {
        this.router.route("/airtime").post(this.topup.airtime);
        this.router.route("/data").post(this.topup.data);
    
        return this.router;
    }
};