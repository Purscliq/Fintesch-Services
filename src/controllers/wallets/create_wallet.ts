import { config } from "dotenv";
import axios from "axios";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/decode_token";
import { KYC } from "../../models/KYC";
import { Wallet } from "../../models/Wallet";
import { Transaction } from "../../models/Transaction";

config();
const budKey = process.env.bud_key as string;

// set headers
const headers = {
  authorization: `Bearer ${budKey}`,
  "content-type": "application/json",
};

// Create Customer and account
export const createCustomer = async (req: Request, res: Response) => {
  try {
    // Get user data from auth token
    const authHeader = req.headers.authorization as string;
    const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
    const url = "https://api.budpay.com/api/v2/customer";
    const kyc = await KYC.findOne({ user: userPayload.userId }).select(
      "firstName lastName phoneNumber status"
    );

    if (!kyc) return res.status(StatusCodes.NOT_FOUND).send("KYC Not Found");
    if (!kyc.status)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send("You are yet to be verified");

    // Create customer
    const customer = {
      email: userPayload.email,
      first_name: kyc.firstName,
      last_name: kyc.lastName,
      phone: kyc.phoneNumber,
    };
    const response = await axios.post(url, customer, { headers });
    const customerCode = response.data.data.customer_code;
    return customerCode;
  } catch (error: any) {
    console.log(error);
  }
};

// Create account
export const createAccount = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization as string;
  const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload;
  const url = "https://api.budpay.com/api/v2/dedicated_virtual_account";
  const customerCode = await createCustomer(req, res);
  
  try {
    // make axios call to API to create account
    // @params url, customer_code, headers
    const response = await axios.post(
      url,
      { customer: customerCode },
      { headers }
    );

    const info = response.data;

    // account model payload
    const accountData = {
      user: userPayload.userId,
      id: info.data.id,
      bank: info.data.bank,
      account_name: info.data.account_name,
      account_number: info.data.account_number,
      reference: info.data.reference,
      assignment: info.data.assignment,
      customer: info.data.customer,
      created_at: info.data.created_at,
      updated_at: info.data.updated_at,
      domain: info.data.domain,
    };

    // store account details to customer database
    const wallet = new Wallet(accountData);
    await wallet.save();

    // return results
    return res.status(StatusCodes.OK).json({
      message: "Wallet creation successful",
      wallet: info.data
    });
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};
