import { Router } from 'express';

export class WalletManagementRoute {
    private router: Router;
  
    constructor() {
        this.router = Router();
        this.instantiate();
    };
    
    public instantiate = () => {
        return this.router;
    }
}