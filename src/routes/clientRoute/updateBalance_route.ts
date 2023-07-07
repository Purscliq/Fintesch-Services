// IMPORT ROUTER
import express from 'express'
const router = express.Router()
import { updateBalance } from '../../controllers/wallets/operations/updateBalance'

router.route("/")
    .patch( updateBalance )

export = router
