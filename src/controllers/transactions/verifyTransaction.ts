import { config } from 'dotenv'
import { Request, Response } from "express"
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { Transaction } from '../../models/Transaction'