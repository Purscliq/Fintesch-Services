// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { bvnVerification } from '../../controllers/user/BVN_Verification'

router.route("/")
    .post(bvnVerification)

export = router

