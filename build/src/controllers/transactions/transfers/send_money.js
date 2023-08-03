"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMoneyService = void 0;
// IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const Transaction_1 = require("../../../models/Transaction");
const Wallet_1 = require("../../../models/Wallet");
const token_service_1 = require("../../users/utils/token_service");
(0, dotenv_1.config)();
class SendMoneyService {
    constructor() {
        this.getBankList = async (req, res) => {
            const bankListUrl = `${this.budBaseUrl}/v2/bank_list`;
            try {
                const response = await axios_1.default.get(bankListUrl, { headers: { authorization: `Bearer ${this.budKey}` } });
                // returns an array of objects
                const bankList = response.data.data;
                return res.status(http_status_codes_1.StatusCodes.OK).json({ bankList });
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json("An error occurred with generating bank list");
            }
        };
        this.accountNameValidation = async (req, res) => {
            const validationData = {
                bank_code: req.body.bankCode,
                account_number: req.body.accountNumber,
                currency: "NGN"
            };
            try {
                const url = `${this.budBaseUrl}/v2/account_name_verify`;
                const response = await axios_1.default.post(url, validationData, { headers: this.headers });
                const walletName = response.data.data;
                return res.status(http_status_codes_1.StatusCodes.OK).json(walletName);
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json("An unexpected error occurred");
            }
        };
        this.sendMoney = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = this.token.decode(authHeader.split(" ")[1]);
            const { accountNumber, bankName, bankCode, amount, narration, PIN } = req.body;
            const wallet = await Wallet_1.Wallet.findOne({ user: userPayload.userId }).select("PIN balance");
            if (!wallet)
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json("This account does not exist");
            if (PIN !== wallet.PIN)
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ error: "Wrong PIN" });
            if ((wallet.balance) < (parseInt(amount) + 20.00))
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ Error: "Insufficient Balance" });
            const sendMoneyPayload = {
                currency: "NGN",
                amount,
                bank_code: bankCode,
                bank_name: bankName,
                account_number: accountNumber,
                narration
            };
            try {
                const url = `${this.budBaseUrl}/v2/bank_transfer`;
                const response = await axios_1.default.post(url, sendMoneyPayload, { headers: this.headers });
                const info = response.data;
                if (!info || info.status !== true) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: "Transaction Failed",
                        info
                    });
                }
                ;
                const { data } = info;
                console.log(data);
                await Transaction_1.Transaction.create({
                    user: userPayload.userId,
                    ...data
                });
                const newBalance = (wallet.balance) - parseInt(amount);
                wallet.balance = newBalance;
                await wallet.save();
                return res.status(http_status_codes_1.StatusCodes.OK).json(info);
            }
            catch (error) {
                console.error(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
            }
        };
        this.budKey = process.env.bud_key;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
        this.budBaseUrl = process.env.budBaseUrl;
        this.token = new token_service_1.Token;
    }
}
exports.SendMoneyService = SendMoneyService;
;
