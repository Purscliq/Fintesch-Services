import express from 'express';
import { ForgotPassword } from '../controllers/password/forgot_password';


const reset = new ForgotPassword();
const { getResetOtp, verifyResetOtp, updatePassword } = reset;


const router = express.Router();


router.route("/")
    .post(getResetOtp)
    .get(verifyResetOtp)
router.route("/:id")
    .put(updatePassword)

export = router