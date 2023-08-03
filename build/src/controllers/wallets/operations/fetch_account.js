"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAccountDetails = void 0;
const dotenv_1 = require("dotenv");
const http_status_codes_1 = require("http-status-codes");
(0, dotenv_1.config)();
const budKey = process.env.bud_key;
// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
};
const fetchAccountDetails = async (req, res) => {
    try {
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
};
exports.fetchAccountDetails = fetchAccountDetails;
