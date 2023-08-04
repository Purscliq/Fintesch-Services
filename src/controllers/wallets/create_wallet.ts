import { config } from "dotenv";
import axios from "axios";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { Token } from "../users/utils/token_service";
import { KYC } from "../../models/KYC";
import { Wallet } from "../../models/Wallet";;
import { HeaderType } from "../../types_interfaces";

config();

export class Wallets {
  private budBaseUrl: string;
  private budKey: string;
  private headers: HeaderType
  private token: Token;

  constructor() {
      this.budBaseUrl = process.env.budBaseUrl as string;
      this.budKey = process.env.bud_key as string;
      this.headers = {
          authorization: `Bearer ${this.budKey}`,
          'content-type': 'application/json'
      };
      this.token = new Token;
  };
 
  public createCustomer = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization as string;
    const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;

    const CustomerCreationEndPoint = `${this.budBaseUrl}/v2/customer`;

      try {
        const kyc = await KYC.findOne({ user: userPayload.userId }).select( "firstName lastName phoneNumber status" );
    
        if (!kyc) 
          return res
            .status(StatusCodes.NOT_FOUND)
            .send("KYC Not Found");
 
        if (!kyc.status)
          return res
            .status(StatusCodes.NOT_FOUND)
            .send("You are yet to be verified");
    
        const customer = {
          email: userPayload.email,
          first_name: kyc.firstName,
          last_name: kyc.lastName,
          phone: kyc.phoneNumber,
        };

        const response = await axios.post(CustomerCreationEndPoint, customer, { headers: this.headers });
        const customerCode = response.data.data.customer_code;
        return customerCode;
      } catch (error: any) {
          console.log(error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
      };


  public createWallet = async (req: Request, res: Response) => {
      const authHeader = req.headers.authorization as string;
      const userPayload = this.token.decode(authHeader.split(" ")[1]) as JwtPayload;
      const virtualAccountEndPoint = `${this.budBaseUrl}/v2/dedicated_virtual_account`;
      
      const customerCode = await this.createCustomer(req, res);

      try {
        const response = await axios.post(
          virtualAccountEndPoint,
          { customer: customerCode },
          { headers: this.headers }
        );

        const info = response.data;

        if (!info || info.status !== true) return res.status(StatusCodes.BAD_REQUEST).json(
            { 
              error: "Transaction Failed" 
            }
          );

        const accountData = {
          user: userPayload.userId,
          id: info.data.id,
          bank: info.data.bank,
          account_name: info.data.account_name,
          account_number: info.data.account_number,
          currency: info.data.currency,
          status: info.data.status,
          reference: info.data.reference,
          assignment: info.data.assignment,
          customer: info.data.customer,
          created_at: info.data.created_at,
          updated_at: info.data.updated_at,
          domain: info.data.domain,
        };

        const wallet = new Wallet(accountData);
        await wallet.save();
        return res.status(StatusCodes.OK).json(
          {
            message: "Wallet creation successful",
            wallet: info.data
          }
        );

      } catch (error: any) {
          console.error(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
      }
    };
}

