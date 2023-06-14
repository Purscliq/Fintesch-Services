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
    Bank: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    fee: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: {
            values: ["withdrawal, deposit, transfer"]
        }
    },
    status: {
        type: String,
        enum: {
            values: ["Pending, Success, Failed"]
        },
        default: "Pending" 
    }
},

  { timestamps : true, strict: true }
)

export const Transaction = model("Transaction", transactionSchema)

