// IMPORT ROUTER
import { Router } from 'express';
import { UserService } from '../../controllers/users/user_service';
import { VerifySignupMail } from '../../controllers/utils/verify_signup_mail';
import { ResendOtp } from '../../controllers/utils/resend_signup_otp';
import { verifyToken } from '../../../middlewares/authenticate';
// import { VerifyResetEmailAndSendOtp } from '../../controllers/password/send_password_reset_otp';

export class AuthRoutes {
    private router: Router ;
    private user: UserService;
    private verifyMail: VerifySignupMail;
    // private verifyResetMail: VerifyResetEmailAndSendOtp;
    private resendPassword: ResendOtp;
    
    constructor() {
        this.router = Router();
        this.user = new UserService;
        this.verifyMail = new VerifySignupMail;
        // this.verifyResetMail = new VerifyResetEmailAndSendOtp;
        this.resendPassword = new ResendOtp;
    }

    public instantiate() {
        this.router.route("/signup").post(this.user.signup);
        this.router.route("/signin").post(this.user.signin);
        this.router.route("/signout").post(verifyToken, this.user.signout)
        this.router.route("/resendOTP").patch(this.resendPassword.instantiate);
        this.router.route("/verify").patch(this.verifyMail.verify);

        return this.router;
    }
}




