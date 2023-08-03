import { Request, Response } from 'express';
import { ForgotPassword } from './forgot_password';
import { ChangePassword } from '../change_passsword';
import { ResetPassword } from './reset_password';


export class PasswordService {
    private forgotPassword: ForgotPassword
    private changePwd: ChangePassword;
    private reset: ResetPassword;

    constructor() {
        this.forgotPassword = new ForgotPassword;
        this.changePwd = new ChangePassword;
        this.reset = new ResetPassword;
    }

    public getResetOtp(req: Request, res: Response) {
        return this.forgotPassword.getResetOtp(req, res);
    }
    
    public verifyResetOtp(req: Request, res: Response) {
        return this.forgotPassword.verifyResetOtp(req, res);
    }

    // To be fixed
    public resendResetOtp(res: Response, email: string) {
        return this.forgotPassword.resendResetOtp(res, email);
    }

    public update(req: Request, res: Response) {
        return this.reset.reset(req, res)
    }

    public changePassword(req: Request, res: Response) {
        return this.changePwd.update(req, res);
    }

}