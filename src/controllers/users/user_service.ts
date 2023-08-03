import { config } from 'dotenv';
import { Auth } from "./auth";
import { Profile } from './profile';
import { Request, Response } from 'express';

config();

export class Users {
    private auth: Auth;
    private profile: Profile;

    constructor() {
        this.auth = new Auth;
        this.profile = new Profile;
    }

    public signup = (req: Request, res: Response) => this.auth.signup(req, res);
    
    public signin = (req: Request, res: Response) => this.auth.signin(req, res);

    public signout = (req: Request, res: Response) => this.auth.signout(req, res);

    public viewProfile = (req: Request, res: Response) => this.profile.viewProfile(req, res);

    public updateProfile = (req: Request, res: Response) => this.profile.updateProfile(req, res);

    public deleteProfile = (req: Request, res: Response) => this.profile.deleteProfile(req, res);
}