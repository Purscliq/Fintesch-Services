import { Router } from 'express';

export class CardManagementRoute {
    private router: Router;
  
    constructor() {
        this.router = Router();
        this.instantiate();
    };
    
    public instantiate = () => {
        return this.router;
    }
}