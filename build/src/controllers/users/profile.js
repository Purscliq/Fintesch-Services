"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMyProfile = exports.editMyProfile = exports.viewMyProfile = void 0;
//IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const User_1 = require("../../models/User");
const auth_1 = require("./auth");
const http_status_codes_1 = require("http-status-codes");
const decodeToken_1 = require("../utils/decodeToken");
(0, dotenv_1.config)();
// GET YOUR PROFILE
const viewMyProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const data = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
        const myProfile = await User_1.User.findOne({ _id: data.userId });
        console.log(myProfile);
        return res.status(http_status_codes_1.StatusCodes.OK)
            .json(myProfile);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(error.message);
    }
};
exports.viewMyProfile = viewMyProfile;
// EDIT PROFILE DETAILS
const editMyProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const data = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
        const updatedProfile = await User_1.User.findOneAndUpdate({ _id: data.userId }, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedProfile) {
            return res.send("Error occurred: cannot update profile");
        }
        // Create new token that contains updated data
        const token = (0, auth_1.createToken)(updatedProfile.email, updatedProfile._id);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ token, updatedProfile });
    }
    catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
};
exports.editMyProfile = editMyProfile;
// DELETE USER ACCOUNT
const deleteMyProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const data = (0, decodeToken_1.decodeToken)(authHeader.split(" ")[1]);
        await User_1.User.findOneAndDelete({ _id: data.userId });
        return res.status(200).json({ Success: "Your account has been deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(400)
            .json(error.message);
    }
};
exports.deleteMyProfile = deleteMyProfile;
// USER SIGNOUT METHOD
// export const signOut = async (req:Request, res:Response) => {
//     try {
//         return res.cookie("jwt", "", { maxAge: 1 }).status(StatusCodes.OK).json({
//             message: "You have been successfully Logged Out"
//         })
//     } catch (error) {
//         console.error(error)
//         return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
//     }
// }
