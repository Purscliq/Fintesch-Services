import { config } from 'dotenv';
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { decodeToken } from '../utils/decode_token';
import { Card } from '../../models/Card';
import { Wallet } from '../../models/Wallet';
import { KYC } from '../../models/KYC';


