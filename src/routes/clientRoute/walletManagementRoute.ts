import express from 'express'
import { createAccount } from '../../controllers/accounts/createAccount'
const router = express.Router()

// router.route("/create-customer").post(createCustomer)
router.route("/create-account").post(createAccount)


export = router
