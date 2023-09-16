import { Router } from "express";

import { AuthRoutes } from './clientRoute/auth_route';
import { PasswordRoute } from './clientRoute/password_route';
import { ProfileManagementRoute } from './clientRoute/profile_management_route';
import { WalletRoutes } from './clientRoute/wallet_management_route';
import { TransactionsRoute } from './clientRoute/transaction_route';
import { KycRoute } from './clientRoute/kyc_verification_route';
import { QuickServicesRoute }from './clientRoute/quickservices_route';
import { WalletManagementRoute } from "./adminRoute/wallet_management_route";
import { TransactionManagementRoute } from "./adminRoute/transaction_management_route";
import { UserManagementRoute } from "./adminRoute/user_management_route";
import { CardManagementRoute } from "./adminRoute/card_management_route";
import { BalanceUpdateRoute } from './clientRoute/updateBalance_route';

import { verifyToken } from '../../middlewares/authenticate';
import { CheckRole } from '../../middlewares/check_role';

export class AppRoutes {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    public mount = () => {
        this.router.use("/api", verifyToken);
        this.router.use("/auth", new AuthRoutes().instantiate());
        this.router.use("/password/reset", new PasswordRoute().instantiate);
        this.router.use("/api/profile", new ProfileManagementRoute().instantiate);
        this.router.use("/api/kyc", new KycRoute().instantiate);
        this.router.use("/api/wallet", new WalletRoutes().instantiate);
        this.router.use("/api/transaction", new TransactionsRoute().instantiate);
        this.router.use("/api/transaction/update_bal", new BalanceUpdateRoute().instantiate);
        this.router.use("/services", new QuickServicesRoute().instantiate);
        this.router.use("/api/admin/users", new UserManagementRoute().instantiate);
        this.router.use("/api/admin/wallet", new WalletManagementRoute().instantiate);
        this.router.use("/api/admin/transactions", new TransactionManagementRoute().instantiate);
        this.router.use("/api/admin/cards", new CardManagementRoute().instantiate);
        this.router.use("api/admin", new CheckRole("admin").check);
        
        return this.router;
    }
}