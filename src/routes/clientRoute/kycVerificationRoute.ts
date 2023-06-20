// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { bvnVerification } from '../../controllers/accounts/bvnVerification'

router.route("/")
    .post(bvnVerification)

export = router

