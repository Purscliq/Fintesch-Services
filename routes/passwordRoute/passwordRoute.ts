import express from 'express'
import { ResetPassword } from '../../controllers/password/passwordReset'
// import { verifyToken } from '../../middlewares/authenticate';
// import { isVerified } from '../../middlewares/checkVerified';

const router = express.Router()
const reset = new ResetPassword()
const { forgotPassword, changePassword, resetPassword } = reset

router.route("/")
    .post(changePassword)
router.route("/reset")
    .post(forgotPassword)
    .patch(resetPassword)
    

export = router