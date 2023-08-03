// IMPORT MONGOOSE.SCHEMA, MONGOOSE.MODEL, MONGOOSE.INFERSCHEMATYPE
import { Schema, model, InferSchemaType } from 'mongoose'
type Wallet = InferSchemaType<typeof Schema>

const walletSchema = new Schema<Wallet>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    id: Number,
    bank: {
        name: String,
        id: Number,
        bank_code: String,
        prefix: String
    },
    account_name: String,
    account_number: String,
    reference: String,
    assignment: String,
    balance: {
        type: Number,
        required: true,
        default: 0.00
    },
    currency: {
        type: String
    },
    status: {
        type: String
    },
    PIN: {
        type: Number,
        unique: true,
        maximum: 4
    },
    customer: {
        id: Number,
        first_name: String,
        last_name: String,
        email: String,
        customer_code: String,
        phone: String
    },
    created_at: Date,
    updated_at: Date,
    domain: String
})

export const Wallet = model("Wallet", walletSchema);

