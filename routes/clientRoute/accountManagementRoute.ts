import express from 'express'
import { createCustomer } from '../../controllers/user/account'
const router = express.Router()

router.route("/create-customer").post(createCustomer)

export = router
