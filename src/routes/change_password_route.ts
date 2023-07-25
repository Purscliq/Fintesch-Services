import express from 'express'
import { ResetPassword } from '../controllers/password/forgot_password'


const reset = new ResetPassword();
const { updatePassword } = reset;


const router = express.Router();

router.route("/").patch(updatePassword)

export = router