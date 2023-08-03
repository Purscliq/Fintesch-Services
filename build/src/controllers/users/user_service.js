"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const dotenv_1 = require("dotenv");
const auth_1 = require("./auth");
const profile_1 = require("./profile");
(0, dotenv_1.config)();
class Users {
    constructor() {
        this.signup = (req, res) => this.auth.signup(req, res);
        this.signin = (req, res) => this.auth.signin(req, res);
        this.signout = (req, res) => this.auth.signout(req, res);
        this.viewProfile = (req, res) => this.profile.viewProfile(req, res);
        this.updateProfile = (req, res) => this.profile.updateProfile(req, res);
        this.deleteProfile = (req, res) => this.profile.deleteProfile(req, res);
        this.auth = new auth_1.Auth;
        this.profile = new profile_1.Profile;
    }
}
exports.Users = Users;
