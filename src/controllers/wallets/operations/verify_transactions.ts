import { config } from "dotenv";
import axios from "axios";
import { headerType } from "../../../types_interfaces";
// import { decodeToken } from "../../utils/decode_token";
// import { JwtPayload } from "jsonwebtoken";
// import { Request, Response } from "express";

config();

export class VerifyTransactions {
    private budKey: string;
    private headers: headerType

    constructor() {
        this.budKey = process.env.bud_key as string;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
    }

    public verify = async (url: string, data: any) => {
        try {
        
            const response = await axios.get(url, { headers: this.headers });

            if (!response) throw null;

            const result = response.data;

            if (
                result.status !== true && 
                data.currency !== result.data.currency
              ) 
                throw("Invalid transaction");

            return result;
        } catch(error: any) {
            throw new Error(error);
        }
    } 
}