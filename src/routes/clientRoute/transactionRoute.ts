import express from 'express'
import { fundWallet } from '../../controllers/transactions/fundWallet'
import { acceptMoney } from '../../controllers/transactions/acceptOneTimePayment'
import { sendMoney } from '../../controllers/transactions/transferMoney'
import { fetchTransactionHistory } from '../../controllers/admin/fetchTransactionHistory'
import { accountNameValidation } from '../../controllers/transactions/transferMoney'
import { bankList } from '../../controllers/transactions/transferMoney'

const router = express.Router()

router.route("/fund").post(fundWallet)
router.route("/history").get(fetchTransactionHistory)
router.route("/accept-money").post(acceptMoney)
router.route("/transfer").post(bankList)
router.route("/transfer/send").post(sendMoney)
router.route("/transfer/validate").post(accountNameValidation)

export = router