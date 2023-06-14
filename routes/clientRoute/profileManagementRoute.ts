// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { viewMyProfile, editMyProfile, deleteMyProfile, signOut } from '../../controllers/user/profile'

router.route("/")
    .get(viewMyProfile)
    .patch(editMyProfile)
    .delete(deleteMyProfile)
router.route("/signout").post(signOut)

export = router