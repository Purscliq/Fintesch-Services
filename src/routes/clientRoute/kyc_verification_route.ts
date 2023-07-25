// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { bvnVerification } from '../../controllers/utils/kyc'
import { setTransactionPIN } from '../../controllers/wallets/operations/manage_wallet_Pin.ts'


router.route("/").post(bvnVerification)

router.route("/set-pin").patch(setTransactionPIN)

export = router;