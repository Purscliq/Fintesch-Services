"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopUpService = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const token_service_1 = require("../../users/utils/token_service");
const http_status_codes_1 = require("http-status-codes");
const Top_up_1 = require("../../../models/Top-up");
(0, dotenv_1.config)();
class TopUpService {
    constructor() {
        this.airtime = async (req, res) => {
            // const authHeader = req.headers.authorization as string;
            // const userPayload = new Token().decode(authHeader.split(" ")[1]) as JwtPayload;
            const { phonenumber, network, amount } = req.body;
            const url = `${this.vtuBaseUrl}/airtime?username=${this.username}&password=${this.password}&phone=${phonenumber}&network_id=${network}&amount=${amount}`;
            try {
                const response = await axios_1.default.get(url);
                const data = response.data;
                console.log(data);
                const airtimeTopUpRecord = new Top_up_1.TopUp({
                    // user: userPayload.userId,
                    type: "airtime top up",
                    code: data.code,
                    message: data.message,
                    payment_data: data.data
                });
                await airtimeTopUpRecord.save();
                return res.status(http_status_codes_1.StatusCodes.OK).json(data);
            }
            catch (err) {
                console.error(err);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
            }
        };
        this.data = async (req, res) => {
            const authHeader = req.headers.authorization;
            const userPayload = new token_service_1.Token().decode(authHeader.split(" ")[1]);
            const { phonenumber, network, amount } = req.body;
            const url = `${this.vtuBaseUrl}/data?username=${this.username}&password=${this.password}&phone=${phonenumber}&network_id=${network}&variation_id=M1024`;
            try {
                const response = await axios_1.default.get(url);
                const data = response.data;
                const dataTopUpRecord = new Top_up_1.TopUp({
                    user: userPayload.userId,
                    type: "data top up",
                    code: data.code,
                    message: data.message,
                    payment_data: data.data
                });
                console.log(data);
                await dataTopUpRecord.save();
                return res.status(http_status_codes_1.StatusCodes.OK).json(data);
            }
            catch (err) {
                console.error(err.message);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
            }
        };
        this.username = process.env.vtu_username;
        this.password = process.env.vtu_password;
        this.vtuBaseUrl = process.env.vtu_baseUrl;
    }
    ;
}
exports.TopUpService = TopUpService;
;
//  const data = {
//     code: "success",
//     message:"Data successfully delivered",
//     data: {
//         network: "MTN",
//         data_plan: "MTN Data 1GB (SME) – 30 Days",
//         phone: "07045461790",
//         amount: "NGN259",
//         order_id: "2443"
//     }
// }
