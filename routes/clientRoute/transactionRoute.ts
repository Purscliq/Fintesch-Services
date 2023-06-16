import express from 'express'
const router = express.Router()
import { fundWallet } from '../../controllers/user/fundWallet'
import { acceptMoney } from '../../controllers/user/acceptTransfer'

router.route("/fund")
    .post(fundWallet)
router.route("/accept-money")
    .post(acceptMoney)

export = router