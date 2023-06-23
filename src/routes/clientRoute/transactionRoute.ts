import express from 'express'
import { fundWallet } from '../../controllers/transactions/fundMobileWallet'
import { acceptMoney } from '../../controllers/transactions/oneTimeTransfer'
import { sendMoney } from '../../controllers/transactions/transferMoney'
import { fetchTransactionHistory } from '../../controllers/transactions/fetchTransactionHistory'
import { accountNameValidation } from '../../controllers/transactions/transferMoney'

const router = express.Router()

router.route("/fund").post(fundWallet)
router.route("/accept-money").post(acceptMoney)
router.route("/send-money").post(sendMoney)
router.route("/history").get(fetchTransactionHistory)
router.route("/validate").post(accountNameValidation)


export = router