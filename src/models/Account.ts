import { Schema, model, InferSchemaType } from 'mongoose'
type Account = InferSchemaType<typeof Schema>

const accountSchema = new Schema<Account>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    accountStatus: {
        type: Boolean,
        },
    accountData: {
        type: Object
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
    PIN: {
        type: Number,
        unique: true,
        maximum: 4
    },
})

export const Account = model("Account", accountSchema)

