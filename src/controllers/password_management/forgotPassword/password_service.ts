import { Request, Response } from 'express';
import { ForgotPassword } from './forgot_password';
import { ChangePassword } from '../change_passsword';
import { ResetPassword } from './reset_password';


export class PasswordService {
    private forgotPassword: ForgotPassword
    private changePwd: ChangePassword;

    constructor() {
        this.forgotPassword = new ForgotPassword;
        this.changePwd = new ChangePassword;
    }

    public getResetOtp = (req: Request, res: Response) => this.forgotPassword.getResetOtp(req, res);
    
    public verifyResetOtp = (req: Request, res: Response) => this.forgotPassword.verifyResetOtp(req, res);
    
    // To be fixed
    public resendResetOtp = (res: Response, email: string) => this.forgotPassword.resendResetOtp(res, email);

    public update = (req: Request, res: Response) => ResetPassword.reset(req, res);

    public changePassword = (req: Request, res: Response) => this.changePwd.update(req, res);
}