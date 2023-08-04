"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletBalance = exports.closeAccount = exports.deactivateAccount = exports.activateaccount = exports.viewAccount = exports.viewAllAccounts = void 0;
const Wallet_1 = require("../../models/Wallet");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
const viewAllAccounts = async (req, res) => {
    try {
        const account = await Wallet_1.Wallet.find()
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
const viewAccount = async (req, res) => {
    try {
        const account = await Wallet_1.Wallet.findOne({ _id: req.params.id }).select("firstName lastName email");
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
        const account = await Wallet_1.Wallet.findOne({ _id: req.params.id });
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
        const account = await Wallet_1.Wallet.findOne({ _id: req.params.id });
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
        const account = await Wallet_1.Wallet.findOne({ _id: req.params.id });
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
const getWalletBalance = async () => {
    const balanceUrl = "https://api.budpay.com/api/v2/wallet_balance/NGN";
    const header = {
        authorization: `Bearer ${budKey}`
    };
    try {
        const response = await axios_1.default.get(balanceUrl, { headers: header });
        const balance = response.data.data.balance;
        return balance;
    }
    catch (error) {
        console.error(error);
    }
};
exports.getWalletBalance = getWalletBalance;
