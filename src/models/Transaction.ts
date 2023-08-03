import { Schema, model, InferSchemaType } from 'mongoose'
type Transaction = InferSchemaType<typeof Schema>

const transactionSchema = new Schema<Transaction>({
        user: { type: Schema.Types.ObjectId, ref: "User" },
        id: Number,
        reference: { type: String, unique: true },
        sessionid: String,
        currency: String,
        amount: String,
        fee: String,
        type: String,
        bank_code: String,
        bank_name: String,
        account_number: String,
        account_name: String,
        settled_by: String,
        subaccount: String,
        narration: String,
        status: String,
        channel: String,
        customer: Object,
        message: String,
        metadata: String,
        settlement_batchid: String,
        plan: String,
        card_attempt: Number,
        requested_amount: String,
        ip_address: String,
        paid_at: Date,
        created_at: Date,
        updated_at: Date
    }, 
    { timestamps: true }
)

export const Transaction = model("Transaction", transactionSchema);