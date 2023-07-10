"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// SERVER CONFIGURATIONS
// IMPORT DEPENDENCIES
const dotenv_1 = require("dotenv");
const express_1 = __importStar(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// ROUTES
const auth_route_1 = __importDefault(require("./src/routes/clientRoute/auth_route"));
const forgot_password_route_1 = __importDefault(require("./src/routes/forgot_password_route"));
const change_password_route_1 = __importDefault(require("./src/routes/change_password_route"));
const profile_management_route_1 = __importDefault(require("./src/routes/clientRoute/profile_management_route"));
const wallet_management_route_1 = __importDefault(require("./src/routes/clientRoute/wallet_management_route"));
const transaction_route_1 = __importDefault(require("./src/routes/clientRoute/transaction_route"));
const kyc_verification_route_1 = __importDefault(require("./src/routes/clientRoute/kyc_verification_route"));
const quickservices_route_1 = __importDefault(require("./src/routes/clientRoute/quickservices_route"));
const wallet_management_route_2 = __importDefault(require("./src/routes/adminRoute/wallet_management_route"));
const transaction_management_route_1 = __importDefault(require("./src/routes/adminRoute/transaction_management_route"));
const user_management_route_1 = __importDefault(require("./src/routes/adminRoute/user_management_route"));
const card_management_route_1 = __importDefault(require("./src/routes/adminRoute/card_management_route"));
const updateBalance_route_1 = __importDefault(require("./src/routes/clientRoute/updateBalance_route"));
// CUSTOM MIDDLEWARES
const authenticate_1 = require("./middlewares/authenticate");
const check_admin_1 = require("./middlewares/check_admin");
// DATABASE CONNECTIONS
const connect_1 = require("./config/connect");
// CONNECT TO PORT
const { port } = process.env || 8000;
// SET UP MIDDLEWARES
app.use((0, cookie_parser_1.default)());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use((0, cors_1.default)());
// app.use(notFound);
// MOUNT ROUTES
app.use("/auth", auth_route_1.default);
app.use("/pwd/reset", forgot_password_route_1.default);
app.use("/api", authenticate_1.verifyToken);
app.use("api/admin", check_admin_1.isAdmin);
app.use("/api/pwd/reset", change_password_route_1.default);
app.use("/api/profile", profile_management_route_1.default);
app.use("/api/kyc", kyc_verification_route_1.default);
app.use("/api/wallet", wallet_management_route_1.default);
app.use("/api/transaction", transaction_route_1.default);
app.use("/api/transaction/update_bal", updateBalance_route_1.default);
app.use("/api/services", quickservices_route_1.default);
app.use("/api/admin/users", user_management_route_1.default);
app.use("/api/admin/wallet", wallet_management_route_2.default);
app.use("/api/admin/transactions", transaction_management_route_1.default);
app.use("/api/admin/cards", card_management_route_1.default);
// SERVER CONNECTION FUNCTION
const server = async () => {
    try {
        await (0, connect_1.connectToDatabase)();
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    }
    catch (error) {
        console.error(error.message);
    }
};
// RUN SERVER
server();
