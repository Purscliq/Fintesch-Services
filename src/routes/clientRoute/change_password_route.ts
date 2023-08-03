import { Router }from 'express';
import { ChangePassword } from '../../controllers/password_management/change_passsword';

export class UpdatePasswordRoute {
    private router: Router;
    private changePassword: ChangePassword;

    constructor() {
        this.router = Router();
        this.changePassword = new ChangePassword;
        this.instantiate();
    }
    
    public instantiate = () => {
        this.router.route("/:id").post(this.changePassword.update);

        return this.router;
    }
}