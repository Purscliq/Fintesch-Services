import { Schema, model, InferSchemaType } from 'mongoose'
type Account = InferSchemaType<typeof Schema>

const accountSchema = new Schema<Account>({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    accountNumber: {
        type: Number,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    transactions: {
        type: Schema.Types.ObjectId,
        ref: "Transactions"
    },
    status: {
        type: String,
        enum: { values: ['active', 'dormant', 'suspended', 'closed'], message: '{VALUE} is not supported' },
        default: 'active'
    }
  },

  { timestamps: true, strict: true }
)

export const Account = model("Account", accountSchema)

