// export const receiveWebHook = async(req: Request, res: Response) => {
//     const authHeader = req.headers.authorization as string
//     const userPayload = decodeToken(authHeader.split(" ")[1]) as JwtPayload

//     const transaction = await Transaction.findOne({ user: userPayload.userId })
//     if(!transaction) return res.send("Transaction data does not exist on database")

//     const account = await Account.findOne({ user: userPayload.userId })
//     if(!account) return res.send("Account data does not exist on database")

//     if(req.body.notify === "transaction" && req.body.notifyType === "successful") {
//         const transaction = await Transaction.findOneAndUpdate({ user: userPayload.userId }, req.body, {
//             new: true, 
//             runValidators: true
//         })
//         if(!transaction) return res.send("Transaction data update was not successful")
//         await transaction.save()
//     }

//     if(req.body.notify === "payout" && req.body.notifyType === "successful") {
    
// }