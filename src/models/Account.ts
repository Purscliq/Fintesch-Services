import { Schema, model, InferSchemaType } from 'mongoose'
type Account = InferSchemaType<typeof Schema>

const accountSchema = new Schema<Account>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    PIN: {
        type: Number,
        required: true,
        unique: true,
        maximum: 4
    },
    accountName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: Number,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0.00
    },
    currency: {
        type: String,
        required: true,
        default: "NGN"
    },
    status: {
        type: String,
        enum: { values: ['active', 'dormant', 'closed'], message: '{VALUE} is not supported' },
        default: 'active'
    },
    OTP: Number
  },
  { timestamps: true, strict: true }
)

export const Account = model("Account", accountSchema)

