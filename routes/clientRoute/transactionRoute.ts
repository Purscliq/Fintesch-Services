import express from 'express'
const router = express.Router()
import { fundWallet } from '../../controllers/user/fundWallet'

router.route("/fund")
    .post(fundWallet)
router.route("/pay-with-card")
    .post

export = router