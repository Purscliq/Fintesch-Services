"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
//IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const User_1 = require("../../models/User");
const token_service_1 = require("./utils/token_service");
const http_status_codes_1 = require("http-status-codes");
(0, dotenv_1.config)();
class Profile {
    constructor() {
        this.viewProfile = async (req, res) => {
            try {
                const authHeader = req.headers.authorization;
                const data = this.token.decode(authHeader.split(" ")[1]);
                const myProfile = await User_1.User.findOne({
                    _id: data.userId
                });
                return res.status(http_status_codes_1.StatusCodes.OK).json(myProfile);
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(error.message);
            }
        };
        this.updateProfile = async (req, res) => {
            try {
                const authHeader = req.headers.authorization;
                const data = this.token.decode(authHeader.split(" ")[1]);
                const updatedProfile = await User_1.User.findOneAndUpdate({ _id: data.userId }, req.body, {
                    new: true,
                    runValidators: true
                });
                if (!updatedProfile)
                    return res.send("Error occurred: cannot update profile");
                const token = this.token.create(updatedProfile.email, updatedProfile._id, updatedProfile.role, updatedProfile.isVerified);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ token, updatedProfile });
            }
            catch (error) {
                console.error(error);
                return res.status(400).json(error.message);
            }
        };
        this.deleteProfile = async (req, res) => {
            try {
                const authHeader = req.headers.authorization;
                const data = this.token.decode(authHeader.split(" ")[1]);
                await User_1.User.findOneAndDelete({ _id: data.userId });
                return res.status(200).json({
                    Success: "Your account has been deleted"
                });
            }
            catch (error) {
                console.error(error);
                return res.status(400).json(error.message);
            }
        };
        this.token = new token_service_1.Token;
    }
}
exports.Profile = Profile;
