// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { Authenticate } from '../../controllers/auth' 
import { verifyUserAccount } from '../../controllers/client/verifyUserAccount'
import { resendOTP } from '../../controllers/utils/resendOTP'

const authenticate = new Authenticate()
const {signUp, signIn} = authenticate

router.route("/signup").post(signUp)
router.route("/signin").post(signIn)
router.route("/resendOTP").patch(resendOTP)
router.route("/verify").patch(verifyUserAccount)


export = router