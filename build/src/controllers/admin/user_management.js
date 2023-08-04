"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewSpecificUser = exports.viewAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../models/User");
const viewAllUsers = async (req, res) => {
    try {
        const user = await User_1.User.find();
        if (!user)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Could not retrieve any user");
        return res.status(http_status_codes_1.StatusCodes.OK).json({ user, numOfUsers: user.length });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
    }
};
exports.viewAllUsers = viewAllUsers;
const viewSpecificUser = async (req, res) => {
    try {
        const user = await User_1.User.findOne({ _id: req.params.id });
        if (!user)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Could not retrieve any user");
        return res.status(http_status_codes_1.StatusCodes.OK).json(user);
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
    }
};
exports.viewSpecificUser = viewSpecificUser;
