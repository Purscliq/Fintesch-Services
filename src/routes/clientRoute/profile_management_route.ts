// IMPORT ROUTER
import express from 'express';
import { UserService } from '../../controllers/users/profile';

const users = new UserService();
const { 
        viewProfile, 
        editProfile, 
        deleteProfile, 
        signOut
    } = users;

const router = express.Router();

router.route("/")
    .get(viewProfile)
    .patch(editProfile)
    .delete(deleteProfile)
router.route("/signout").post(signOut)

export = router;

