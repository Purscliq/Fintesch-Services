import { config } from 'dotenv'
import axios from 'axios'
import { Request, Response } from "express"
import { JwtPayload } from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { generateRefID } from '../utils/generateRef'
import { decodeToken } from '../../middlewares/decodeToken'

