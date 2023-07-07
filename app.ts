// SERVER CONFIGURATIONS
// IMPORT DEPENDENCIES
import { config } from 'dotenv' 
import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()

const app = express()

// ROUTES
import authRoute from './src/routes/clientRoute/auth_route'
import forgotPasswordRoute from './src/routes/forgot_password_route'
import changePasswordRoute from './src/routes/change_password_route'
import userProfileRoute from './src/routes/clientRoute/profile_management_route'
import WalletRoute from './src/routes/clientRoute/wallet_management_route'
import userTransactionsRoute from './src/routes/clientRoute/transaction_route'
import kycVerificationRoute from './src/routes/clientRoute/kyc_verification_route'
import quickServicesRoute from './src/routes/clientRoute/quickservices_route'
import walletManagementRoute from "./src/routes/adminRoute/wallet_management_route"
import transactionManagementRoute from "./src/routes/adminRoute/transaction_management_route"
import userManagementRoute from "./src/routes/adminRoute/user_management_route"
import cardManagementRoute from "./src/routes/adminRoute/card_management_route"
import updateBalance from './src/routes/clientRoute/updateBalance_route'

// CUSTOM MIDDLEWARES
import { verifyToken } from './middlewares/authenticate'
import { isAdmin } from './middlewares/checkAdmin'
import { notFound } from './middlewares/not_found'

// DATABASE CONNECTIONS
import { connectToDatabase } from './config/connect'

// CONNECT TO PORT
const { port } = process.env || 8000

// SET UP MIDDLEWARES
app.use(cookieParser())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(notFound);

// MOUNT ROUTES
app.use("/auth", authRoute)
app.use("/pwd/reset", forgotPasswordRoute)
app.use("/api", verifyToken)
app.use("api/admin", isAdmin)
app.use("/api/pwd/reset", changePasswordRoute)
app.use("/api/profile", userProfileRoute)
app.use("/api/kyc", kycVerificationRoute)
app.use("/api/wallet", WalletRoute)
app.use("/api/transaction", userTransactionsRoute)
app.use("/api/transaction/update_bal", updateBalance)
app.use("/api/services", quickServicesRoute)
app.use("/api/admin/users", userManagementRoute )
app.use("/api/admin/wallet", walletManagementRoute)
app.use("/api/admin/transactions", transactionManagementRoute)
app.use("/api/admin/cards", cardManagementRoute)

// SERVER CONNECTION FUNCTION
const server = async () => {
    try {
        await connectToDatabase()
        app.listen( port, () => console.log(`Server is running on port ${port}`) )
    } catch (error: any) { 
        console.error(error.message) 
    }
}

// RUN SERVER
server()