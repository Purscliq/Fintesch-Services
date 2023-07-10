import express from 'express'
import { ResetPassword } from '../controllers/password/password_reset'

const router = express.Router()
const reset = new ResetPassword()
const { resetPassword } = reset

// /api/pwd/reset = /
router.route("/")
    .patch(resetPassword)

export = router