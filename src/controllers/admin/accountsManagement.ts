import { Wallet} from "../../models/Wallet"
import {Request, Response} from 'express'
import axios from "axios"
import {config} from "dotenv"

config()

const budKey = process.env.bud_key as string

export const viewAllAccounts = async ( req: Request, res: Response ) => {
    try {
        const account = await Wallet.find()
            .select( "firstName lastName email" )

        if(!account) {
            return res.send("Could not retrieve any account")
        }

        return res.status(200).json({ account, numOfaccounts: account.length });
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

// VIEW ONE ACCOUNT
export const viewAccount = async ( req: Request, res: Response ) => {
    try {
        const account = await Wallet.findOne({ _id: req.params.id }).select( "firstName lastName email" )

        if(!account) {
            return res.send("Could not retrieve any account")
        }

       return res.status(200).json(account);
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

export const activateaccount = async ( req: Request, res: Response ) => {
    try {
        const account = await Wallet.findOne({ _id: req.params.id })

        if(!account) {
            return res.send("Could not retrieve any accounts")
        }
        if(account.status === "active") {
            return res.status(200).json({ message: `${account.accountName} is already active` })
        } 

        account.status = "active"
        await account.save()

        return res.status(200).json({ message: `${account.accountName} has been successfully activated` })
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

export const deactivateAccount = async ( req: Request, res: Response ) => {
    try {
        const account = await Wallet.findOne({ _id: req.params.id })

        if(!account) {
            return res.send("Could not retrieve any account")
        }

        if(account.status !== "active") {
            return res.status(200).json({ message: `${account.accountName} is already inactive` })
        } 

        account.status = "dormant"
        await account.save()

        return res.status(200).json({ message: `${account.accountName} has been successfully deactivated` })
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

export const closeAccount = async ( req: Request, res: Response ) => {
    try {
        const account = await Wallet.findOne({ _id: req.params.id })

        if(!account) {
            return res.send("Could not retrieve any account")
        }

        if(account.status !== "closed") {
            return res.status(200).json({ message: `${account.accountName} is already inactive` })
        } 

        account.status = "closed"
        await account.save()

        return res.status(200).json({ message: `${account.accountName} has been successfully deactivated` })
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

// retreive wallet balance
export const getWalletBalance = async() => {
    const balanceUrl = "https://api.budpay.com/api/v2/wallet_balance/NGN"
    const header = {
        authorization: `Bearer ${budKey}` 
    }
    try {
        const response = await axios.get(balanceUrl, { headers: header })
        const balance = response.data.data.balance 
        return balance
    } catch(error: any) {
        console.error(error)
    }
}