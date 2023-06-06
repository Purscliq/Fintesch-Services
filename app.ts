// SERVER CONFIGURATIONS
// IMPORT DEPENDENCIES
import { config } from 'dotenv' 
import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()

const app = express()

// ROUTES
import authRoute from './routes/clientRoute/authRoute'
import passwordRoute from './routes/passwordRoute/passwordRoute'
import kycRoute from './routes/clientRoute/kycRoute'
import userProfileRoute from './routes/clientRoute/profileManagementRoute'
import userAccountRoute from './routes/clientRoute/accountManagementRoute'
import userTransactionsRoute from './routes/clientRoute/transactionRoute'
import quickServicesRoute from './routes/clientRoute/quickServicesRoute'
import accountManagementRoute from "./routes/adminRoute/accountmanagementRoute"
import transactionManagementRoute from "./routes/adminRoute/transactionManagementRoute"
import userManagementRoute from "./routes/adminRoute/userManagementRoute"

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
app.use("/api", verifyToken)
app.use("/auth", authRoute)
app.use("/api/KYC", kycRoute)
app.use("api/admin", isAdmin)
app.use("/api/pwd", passwordRoute)
app.use("/api/profiles", userProfileRoute)
app.use("/api/accounts", userAccountRoute)
app.use("/api/transactions", userTransactionsRoute)
app.use("/api/services", quickServicesRoute)
app.use("/api/admin/users", userManagementRoute )
app.use("/api/admin/accounts", accountManagementRoute)
app.use("/api/admin/transactions", transactionManagementRoute)

// SERVER CONNECTION FUNCTION
const server = async () => {
    try {
        await connectToDatabase()
        app.listen( port, () => console.log(`Server is running on port ${port}`) )
    } catch (error: any) { console.log(error.message) }
}

// RUN SERVER
server()