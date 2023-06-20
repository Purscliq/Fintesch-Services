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
const authRoute_1 = __importDefault(require("./src/routes/clientRoute/authRoute"));
const forgotPasswordRoute_1 = __importDefault(require("./src/routes/forgotPasswordRoute"));
const changePasswordRoute_1 = __importDefault(require("./src/routes/changePasswordRoute"));
const profileManagementRoute_1 = __importDefault(require("./src/routes/clientRoute/profileManagementRoute"));
const accountManagementRoute_1 = __importDefault(require("./src/routes/clientRoute/accountManagementRoute"));
const transactionRoute_1 = __importDefault(require("./src/routes/clientRoute/transactionRoute"));
const kycVerificationRoute_1 = __importDefault(require("./src/routes/clientRoute/kycVerificationRoute"));
const quickServicesRoute_1 = __importDefault(require("./src/routes/clientRoute/quickServicesRoute"));
const accountmanagementRoute_1 = __importDefault(require("./src/routes/adminRoute/accountmanagementRoute"));
const transactionManagementRoute_1 = __importDefault(require("./src/routes/adminRoute/transactionManagementRoute"));
const userManagementRoute_1 = __importDefault(require("./src/routes/adminRoute/userManagementRoute"));
const cardManagementRoute_1 = __importDefault(require("./src/routes/adminRoute/cardManagementRoute"));
// CUSTOM MIDDLEWARES
const authenticate_1 = require("./middlewares/authenticate");
const checkAdmin_1 = require("./middlewares/checkAdmin");
// DATABASE CONNECTIONS
const connect_1 = require("./config/connect");
// CONNECT TO PORT
const { port } = process.env || 8000;
// SET UP MIDDLEWARES
app.use((0, cookie_parser_1.default)());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use((0, cors_1.default)());
//MOUNT ROUTES
app.use("/auth", authRoute_1.default);
app.use("/pwd/reset", forgotPasswordRoute_1.default);
app.use("/api", authenticate_1.verifyToken);
app.use("api/admin", checkAdmin_1.isAdmin);
app.use("/api/pwd/reset", changePasswordRoute_1.default);
app.use("/api/profile", profileManagementRoute_1.default);
app.use("/api/verifyId", kycVerificationRoute_1.default);
app.use("/api/account", accountManagementRoute_1.default);
app.use("/api/transaction", transactionRoute_1.default);
app.use("/api/services", quickServicesRoute_1.default);
app.use("/api/admin/users", userManagementRoute_1.default);
app.use("/api/admin/accounts", accountmanagementRoute_1.default);
app.use("/api/admin/transactions", transactionManagementRoute_1.default);
app.use("/api/admin/cards", cardManagementRoute_1.default);
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
