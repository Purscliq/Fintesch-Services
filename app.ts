// SERVER CONFIGURATIONS
// IMPORT DEPENDENCIES
import { config } from 'dotenv' 
import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()

const app = express()

// ROUTES
import authRoute from './src/routes/clientRoute/authRoute'
import forgotPasswordRoute from './src/routes/forgotPasswordRoute'
import changePasswordRoute from './src/routes/changePasswordRoute'
import userProfileRoute from './src/routes/clientRoute/profileManagementRoute'
import WalletRoute from './src/routes/clientRoute/walletManagementRoute'
import userTransactionsRoute from './src/routes/clientRoute/transactionRoute'
import kycVerificationRoute from './src/routes/clientRoute/kycVerificationRoute'
import quickServicesRoute from './src/routes/clientRoute/quickServicesRoute'
import walletManagementRoute from "./src/routes/adminRoute/walletmanagementRoute"
import transactionManagementRoute from "./src/routes/adminRoute/transactionManagementRoute"
import userManagementRoute from "./src/routes/adminRoute/userManagementRoute"
import cardManagementRoute from "./src/routes/adminRoute/cardManagementRoute"
import webhookRoute from './src/routes/clientRoute/webhookRoute'

// CUSTOM MIDDLEWARES
import { verifyToken } from './middlewares/authenticate'
import { isAdmin } from './middlewares/checkAdmin'

// DATABASE CONNECTIONS
import { connectToDatabase } from './config/connect'

// CONNECT TO PORT
const { port } = process.env || 8000

// SET UP MIDDLEWARES
app.use(cookieParser())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())

//MOUNT ROUTES
app.use("/auth", authRoute)
app.use("/pwd/reset", forgotPasswordRoute)
app.use("/api", verifyToken)
app.use("api/admin", isAdmin)
app.use("/api/pwd/reset", changePasswordRoute)
app.use("/api/profile", userProfileRoute)
app.use("/api/kyc", kycVerificationRoute)
app.use("/api/account", WalletRoute)
app.use("/api/transaction", userTransactionsRoute)
app.use("/api/transaction", webhookRoute)
app.use("/api/services", quickServicesRoute)
app.use("/api/admin/users", userManagementRoute )
app.use("/api/admin/accounts", walletManagementRoute)
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