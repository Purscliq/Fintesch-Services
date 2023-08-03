import { Router }from 'express';
import { ForgotPassword } from '../../controllers/password_management/forgotPassword/forgot_password';
import { ResetPassword } from '../../controllers/password_management/forgotPassword/reset_password';

export class ForgotPasswordRoute {
    private router: Router;
    private forgotPassword: ForgotPassword;
    private resetPassword: ResetPassword;

    constructor() {
        this.router = Router();
        this.forgotPassword = new ForgotPassword;
        this.resetPassword = new ResetPassword;
        this.instantiate();
    }
    
    public instantiate = () => {
        this.router.route("/").post(this.forgotPassword.getResetOtp)
            .get(this.forgotPassword.verifyResetOtp);
        this.router.route("/:id").post(this.resetPassword.reset);

        return this.router;
    }
}