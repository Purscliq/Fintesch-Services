import { Router } from 'express';
import { Users } from '../../controllers/users/user_service';
import { VerifySignupMail } from '../../controllers/users/utils/verify_signup_mail';
import { verifyToken } from '../../../middlewares/authenticate';

export class AuthRoutes {
   private router: Router;
    private user: Users;
    // private verifyMail: VerifySignupMail;
    
    constructor() {
        this.router = Router();
        // this.verifyMail = new VerifySignupMail;
        this.user = new Users;
        this.instantiate();
    };

    public instantiate = () => {
        this.router.route("/signup").post(this.user.signup);
        this.router.route("/verify").patch(VerifySignupMail.verify);
        // this.router.route("/verify").patch(this.verifyMail.verify);
        this.router.route("/signin").post(this.user.signin);
        this.router.route("/signout").post(verifyToken, this.user.signout);
        this.router.route("/signout").post(verifyToken, this.user.signout);

        return this.router;
    };
}