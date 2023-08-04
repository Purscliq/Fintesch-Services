import { Router }from 'express';
import { ForgotPassword } from '../../controllers/password_management/forgotPassword/forgot_password';
import { ResetPassword } from '../../controllers/password_management/forgotPassword/reset_password';

export class ForgotPasswordRoute {
    private router: Router;
    private forgotPassword: ForgotPassword;

    constructor() {
        this.router = Router();
        this.forgotPassword = new ForgotPassword;
        this.instantiate();
    }
    
    public instantiate = () => {
        this.router.route("/").post(this.forgotPassword.getResetOtp)
            .get(this.forgotPassword.verifyResetOtp);
        this.router.route("/:id").post(ResetPassword.reset);

        return this.router;
    }
}