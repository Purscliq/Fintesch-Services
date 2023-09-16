import { Request, Response } from 'express';
import { ForgotPassword } from './forgotPassword/forgot_password';
import { ResetPassword } from '../../controllers/password_management/reset_password';


export class PasswordService {
    private forgotPassword: ForgotPassword

    constructor() {
        this.forgotPassword = new ForgotPassword;
    }

    public getResetOtp = (req: Request, res: Response) => this.forgotPassword.getResetOtp(req, res);

    // To be fixed
    public resendResetOtp = (email: string) => this.forgotPassword.resendResetOtp(email);
    
    public verifyResetOtp = (req: Request, res: Response) => this.forgotPassword.verifyResetOtp(req, res);

    public editPassword = (req: Request, res: Response) => ResetPassword.reset(req, res);
}