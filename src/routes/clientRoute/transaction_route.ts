import express from 'express'
import { FundWalletService } from '../../controllers/transactions/cards/card_fund_wallet';
import { SendMoneyService } from '../../controllers/transactions/transfers/transfer_money';

const fundWallet = new FundWalletService();
const sendMoney = new SendMoneyService();

// import { acceptMoney } from '../../controllers/transactions/transfers/one_time_payment'
// import { fetchTransactionHistory } from '../../controllers/admin/fetch_transaction_history'

const router = express.Router()

router.route("/fund").post(fundWallet.fund)
router.route("/transfer").get(sendMoney.getBankList)
router.route("/transfer/validate").post(sendMoney.accountNameValidation)
router.route("/transfer/send").post(sendMoney.send)
// router.route("/accept-money").post(acceptMoney)
// router.route("/history").get(fetchTransactionHistory)

export = router;