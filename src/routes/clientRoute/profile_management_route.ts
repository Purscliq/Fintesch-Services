import {Router}from 'express';
import { Users} from '../../controllers/users/user_service';

export class ProfileManagementRoute {
    private router: Router;
    private user: Users;
    
    constructor() {
        this.user = new Users;
        this.router = Router();
        this.instantiate();
    }
    
    public instantiate = () => {
        this.router.route("/")
            .get(this.user.viewProfile)
            .patch(this.user.updateProfile)
            .delete(this.user.deleteProfile);
        
        return this.router;
    }
}

