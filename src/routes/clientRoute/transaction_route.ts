import express from 'express'
import { fundWallet } from '../../controllers/transactions/cards/card_fund_wallet'
import { acceptMoney } from '../../controllers/transactions/transfers/one_time_payment'
import { sendMoney } from '../../controllers/transactions/transfers/transfer_money'
import { fetchTransactionHistory } from '../../controllers/admin/fetchTransactionHistory'
import { accountNameValidation } from '../../controllers/transactions/transfers/transfer_money'
import { bankList } from '../../controllers/transactions/transfers/transfer_money'

const router = express.Router()

router.route("/fund").post(fundWallet)
router.route("/history").get(fetchTransactionHistory)
router.route("/accept-money").post(acceptMoney)
router.route("/transfer").get(bankList)
router.route("/transfer/validate").post(accountNameValidation)
router.route("/transfer/send").post(sendMoney)

export = router