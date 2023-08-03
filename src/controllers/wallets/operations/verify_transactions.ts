import { config } from "dotenv";
import axios from "axios";
import { HeaderType } from "../../../types_interfaces";
// import { decodeToken } from "../../utils/decode_token";
// import { JwtPayload } from "jsonwebtoken";
// import { Request, Response } from "express";

config();

export class VerifyTransactions {
    private budKey: string;
    private headers: HeaderType

    constructor() {
        this.budKey = process.env.bud_key as string;
        this.headers = {
            authorization: `Bearer ${this.budKey}`,
            "content-type": "application/json"
        };
    }

    public async verify(url: string, data: any) {
        try {
            const response = await axios.get(url, { headers: this.headers });

            if (!response) throw 'null value was returned';

            const result = response.data;

            if (
                result.status !== true && 
                data.currency !== result.data.currency
              ) 
                throw "Invalid transaction";

            return result;
        } catch(error: any) {
            console.error(error);
        }
    } 
}