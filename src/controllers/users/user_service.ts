//IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { AuthService} from "./auth"
import { Profile } from './profile'
import { Request, Response } from 'express';

config();

export class UserService {
    private authservice: AuthService;
    private profile: Profile;

    constructor() {
        this.authservice = new AuthService;
        this.profile = new Profile;
    }

    public signup(req: Request, res: Response) {
        return this.authservice.signup(req, res);
    }
    
    public signin(req: Request, res: Response) {
        return this.authservice.signin(req, res);
    }

    public signout(req: Request, res: Response) {
        return this.authservice.signout(req, res);
    }

    public viewProfile(req: Request, res: Response) {
        return this.profile.viewProfile(req, res)
    }
    public updateProfile(req: Request, res: Response) {
        return this.profile.updateProfile(req, res)
    }
    public deleteProfile(req: Request, res: Response) {
        return this.profile.deleteProfile(req, res)
    }
}