import { Schema, model, InferSchemaType } from 'mongoose'
type Transaction = InferSchemaType<typeof Schema>

const transactionSchema = new Schema<Transaction>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    id: Number,
    reference: { type: String, unique: true },
    sessionid: String,
    currency: { type: String, default: "NGN" },
    amount: String,
    fee: String,
    // receiver detail
    bankCode: String,
    bankName: String,
    accountNumber: String,
    accountName: String,
    narration: String,
    status: { type: String, default: "pending" }
})

export const Transaction = model("Transaction", transactionSchema)