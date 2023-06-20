import express from 'express'
import { createAccount, createCustomer } from '../../controllers/accounts/createAccount'
const router = express.Router()

router.route("/create-account").post(createAccount)
router.route("/create-customer").post(createCustomer)

export = router
