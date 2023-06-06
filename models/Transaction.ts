import { Schema, model, InferSchemaType } from 'mongoose'
type Transaction = InferSchemaType<typeof Schema>

const transactionSchema = new Schema<Transaction>({
    refID: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: {
            values: ["withdrawal, deposit, transfer, payment"]
        }
    },
},

  { timestamps : true, strict: true }
)

export const Transaction = model("Transaction", transactionSchema)

