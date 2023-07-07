import express from 'express';
import { createAccount } from '../../controllers/wallets/create_wallet';
import { getWalletBalance } from '../../controllers/wallets/operations/check_wallet_balance';
import { changeTransactionPIN, setTransactionPIN } from '../../controllers/wallets/operations/set_wallet_PIN';

const router = express.Router();

// router.route("/create-customer").post(createCustomer)
router.route("/create-account").post(createAccount);
router.route("/balance").get(getWalletBalance);
router.route("/pin").patch(setTransactionPIN);
router.route("/change_pin").patch(changeTransactionPIN);

export = router;
