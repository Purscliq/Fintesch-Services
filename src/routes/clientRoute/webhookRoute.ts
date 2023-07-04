// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { transactionWebHook } from '../../controllers/transactions/manageWebHook'

router.route("/webhook")
    .post( transactionWebHook )

export = router
