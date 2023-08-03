"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const auth_route_1 = require("./clientRoute/auth_route");
const forgot_password_route_1 = require("./clientRoute/forgot_password_route");
const change_password_route_1 = require("./clientRoute/change_password_route");
const profile_management_route_1 = require("./clientRoute/profile_management_route");
const wallet_management_route_1 = require("./clientRoute/wallet_management_route");
const transaction_route_1 = require("./clientRoute/transaction_route");
const kyc_verification_route_1 = require("./clientRoute/kyc_verification_route");
const quickservices_route_1 = require("./clientRoute/quickservices_route");
const wallet_management_route_2 = require("./adminRoute/wallet_management_route");
const transaction_management_route_1 = require("./adminRoute/transaction_management_route");
const user_management_route_1 = require("./adminRoute/user_management_route");
const card_management_route_1 = require("./adminRoute/card_management_route");
const updateBalance_route_1 = __importDefault(require("./clientRoute/updateBalance_route"));
const authenticate_1 = require("../../middlewares/authenticate");
const check_role_1 = require("../../middlewares/check_role");
class AppRoutes {
    constructor() {
        this.mount = () => {
            this.router.use("/api", authenticate_1.verifyToken);
            this.router.use("/auth", new auth_route_1.AuthRoutes().instantiate());
            this.router.use("/pwd/reset", new forgot_password_route_1.ForgotPasswordRoute().instantiate);
            this.router.use("/api/pwd/reset", new change_password_route_1.UpdatePasswordRoute().instantiate);
            this.router.use("/api/profile", new profile_management_route_1.ProfileManagementRoute().instantiate);
            this.router.use("/api/kyc", new kyc_verification_route_1.KycRoute().instantiate);
            this.router.use("/api/wallet", new wallet_management_route_1.WalletRoutes().instantiate);
            this.router.use("/api/transaction", new transaction_route_1.TransactionsRoute().instantiate);
            this.router.use("/api/transaction/update_bal", updateBalance_route_1.default);
            this.router.use("/services", new quickservices_route_1.QuickServicesRoute().instantiate);
            this.router.use("/api/admin/users", new user_management_route_1.UserManagementRoute().instantiate);
            this.router.use("/api/admin/wallet", new wallet_management_route_2.WalletManagementRoute().instantiate);
            this.router.use("/api/admin/transactions", new transaction_management_route_1.TransactionManagementRoute().instantiate);
            this.router.use("/api/admin/cards", new card_management_route_1.CardManagementRoute().instantiate);
            this.router.use("api/admin", new check_role_1.CheckRole("admin").check);
            return this.router;
        };
        this.router = (0, express_1.Router)();
    }
}
exports.AppRoutes = AppRoutes;
