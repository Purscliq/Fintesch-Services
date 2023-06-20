import express from 'express'
import { fundWallet } from '../../controllers/transactions/fundMobileWallet'
import { acceptMoney } from '../../controllers/transactions/oneTimeTransfer'

const router = express.Router()

router.route("/fund")
    .post(fundWallet)
router.route("/accept-money")
    .post(acceptMoney)

export = router