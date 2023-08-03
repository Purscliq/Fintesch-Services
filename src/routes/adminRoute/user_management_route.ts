import { Router } from 'express';

export class UserManagementRoute {
    private router: Router;
  
    constructor() {
        this.router = Router();
        this.instantiate();
    };
    
    public instantiate = () => {
        return this.router;
    }
}