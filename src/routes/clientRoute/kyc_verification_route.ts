// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { bvnVerification } from '../../controllers/wallets/kyc'
import { setTransactionPIN } from '../../controllers/wallets/operations/set_wallet_PIN'

router.route("/").post(bvnVerification)
router.route("/set-pin").patch(setTransactionPIN)

export = router;