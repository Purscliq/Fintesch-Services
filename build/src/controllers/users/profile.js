"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
//IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const User_1 = require("../../models/User");
const auth_1 = require("./auth");
const http_status_codes_1 = require("http-status-codes");
const decode_token_1 = require("../utils/decode_token");
(0, dotenv_1.config)();
// GET YOUR PROFILE
class UserService {
    constructor(authservice) {
        this.authservice = authservice;
        this.viewProfile = async (req, res) => {
            try {
                const authHeader = req.headers.authorization;
                const data = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
                const myProfile = await User_1.User.findOne({
                    _id: data.userId
                });
                console.log(myProfile);
                return res.status(http_status_codes_1.StatusCodes.OK).json(myProfile);
            }
            catch (error) {
                console.error(error);
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(error.message);
            }
        };
        // EDIT PROFILE DETAILS
        this.editProfile = async (req, res) => {
            try {
                const authHeader = req.headers.authorization;
                const data = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
                const updatedProfile = await User_1.User.findOneAndUpdate({ _id: data.userId }, req.body, {
                    new: true,
                    runValidators: true
                });
                if (!updatedProfile) {
                    return res.send("Error occurred: cannot update profile");
                }
                // Create new token that contains updated data
                const token = (0, auth_1.createToken)(updatedProfile.email, updatedProfile._id, updatedProfile.role);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ token, updatedProfile });
            }
            catch (error) {
                console.error(error);
                res.status(400).json(error.message);
            }
        };
        // DELETE USER ACCOUNT
        this.deleteProfile = async (req, res) => {
            try {
                const authHeader = req.headers.authorization;
                const data = (0, decode_token_1.decodeToken)(authHeader.split(" ")[1]);
                await User_1.User.findOneAndDelete({ _id: data.userId });
                return res.status(200).json({
                    Success: "Your account has been deleted"
                });
            }
            catch (error) {
                console.error(error);
                res.status(400).json(error.message);
            }
        };
        this.signOut = async (req, res) => {
            try {
                return req.headers.authorization = undefined;
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(http_status_codes_1.ReasonPhrases.BAD_REQUEST);
            }
        };
    }
}
exports.UserService = UserService;
