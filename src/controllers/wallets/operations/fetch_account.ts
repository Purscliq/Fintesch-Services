import { config } from 'dotenv'
import axios from 'axios'
import { Request, Response } from "express"
import { JwtPayload } from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { Token } from '../../users/utils/token_service';
import { KYC } from '../../../models/KYC'

config()

const budKey = process.env.bud_key as string

// set headers
const headers = {
    authorization: `Bearer ${budKey}`,
    "content-type": "application/json"
}

export const fetchAccountDetails = async(req: Request, res: Response) => {
    try {

    } catch(error: any) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
    }
}