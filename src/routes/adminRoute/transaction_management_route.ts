import { Router } from 'express';

export class TransactionManagementRoute {
    private router: Router;
  
    constructor() {
        this.router = Router();
        this.instantiate();
    };
    
    public instantiate = () => {
        return this.router;
    }
}