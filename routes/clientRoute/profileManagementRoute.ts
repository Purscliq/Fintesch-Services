// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { viewMyProfile, editMyProfile, deleteMyProfile, signOut } from '../../controllers/client/user'

router.route("/:userId")
    .get(viewMyProfile)
    .patch(editMyProfile)
    .delete(deleteMyProfile)
router.route("/signout").post(signOut)

export = router