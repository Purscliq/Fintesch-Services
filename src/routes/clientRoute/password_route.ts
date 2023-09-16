import { Router } from 'express';
// import { ForgotPassword } from '../../controllers/password_management/forgotPassword/forgot_password';
// import { ResetPassword } from '../../controllers/password_management/reset_password';

import { PasswordService } from '../../controllers/password_management/password_service';
import { verifyToken } from '../../../middlewares/authenticate';

export class PasswordRoute {
    private router: Router;
    private password: PasswordService;

    constructor() {
        this.router = Router();
        this.password = new PasswordService;
        this.instantiate();
    }
    
    public instantiate = () => {
        this.router.route("/").post(this.password.getResetOtp)
            .get(this.password.verifyResetOtp)
            .put(this.password.resendResetOtp);
        this.router.route("/:id").patch(this.password.editPassword)
            .put(verifyToken, this.password.editPassword);

        return this.router;
    }
}