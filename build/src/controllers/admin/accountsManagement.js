"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAccount = exports.deactivateAccount = exports.activateaccount = exports.viewAccount = exports.viewAllAccounts = void 0;
const Account_1 = require("../../models/Account");
const viewAllAccounts = async (req, res) => {
    try {
        const account = await Account_1.Account.find()
            .select("firstName lastName email");
        if (!account) {
            return res.send("Could not retrieve any account");
        }
        return res.status(200).json({ account, numOfaccounts: account.length });
    }
    catch (err) {
        console.error(err);
        res.status(404).json(err.message);
    }
};
exports.viewAllAccounts = viewAllAccounts;
// VIEW ONE ACCOUNT
const viewAccount = async (req, res) => {
    try {
        const account = await Account_1.Account.findOne({ _id: req.params.id }).select("firstName lastName email");
        if (!account) {
            return res.send("Could not retrieve any account");
        }
        return res.status(200).json(account);
    }
    catch (err) {
        console.error(err);
        res.status(404).json(err.message);
    }
};
exports.viewAccount = viewAccount;
const activateaccount = async (req, res) => {
    try {
        const account = await Account_1.Account.findOne({ _id: req.params.id });
        if (!account) {
            return res.send("Could not retrieve any accounts");
        }
        if (account.status === "active") {
            return res.status(200).json({ message: `${account.accountName} is already active` });
        }
        account.status = "active";
        await account.save();
        return res.status(200).json({ message: `${account.accountName} has been successfully activated` });
    }
    catch (err) {
        console.error(err);
        res.status(404).json(err.message);
    }
};
exports.activateaccount = activateaccount;
const deactivateAccount = async (req, res) => {
    try {
        const account = await Account_1.Account.findOne({ _id: req.params.id });
        if (!account) {
            return res.send("Could not retrieve any account");
        }
        if (account.status !== "active") {
            return res.status(200).json({ message: `${account.accountName} is already inactive` });
        }
        account.status = "dormant";
        await account.save();
        return res.status(200).json({ message: `${account.accountName} has been successfully deactivated` });
    }
    catch (err) {
        console.error(err);
        res.status(404).json(err.message);
    }
};
exports.deactivateAccount = deactivateAccount;
const closeAccount = async (req, res) => {
    try {
        const account = await Account_1.Account.findOne({ _id: req.params.id });
        if (!account) {
            return res.send("Could not retrieve any account");
        }
        if (account.status !== "closed") {
            return res.status(200).json({ message: `${account.accountName} is already inactive` });
        }
        account.status = "closed";
        await account.save();
        return res.status(200).json({ message: `${account.accountName} has been successfully deactivated` });
    }
    catch (err) {
        console.error(err);
        res.status(404).json(err.message);
    }
};
exports.closeAccount = closeAccount;
