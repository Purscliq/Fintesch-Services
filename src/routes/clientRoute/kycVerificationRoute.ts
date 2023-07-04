// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { bvnVerification } from '../../controllers/accounts/bvnVerification'
import { setTransactionPIN } from '../../controllers/accounts/setTransactionPIN'

router.route("/").post(bvnVerification)
router.route("/set-pin").patch(setTransactionPIN)

export = router

