// IMPORT ROUTER
import express from 'express'
import { KYC } from '../../controllers/KYC'
const router = express.Router()

router.route("/").post(KYC)

export = router