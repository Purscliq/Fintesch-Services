import express from 'express'
import { ResetPassword } from '../controllers/password/passwordReset'

const router = express.Router()
const reset = new ResetPassword()
const { forgotPassword, verifyOTP, resetPassword } = reset

// /pwd/reset = /
router.route("/")
    .post(forgotPassword)
    .get(verifyOTP)
    .patch(resetPassword)

export = router