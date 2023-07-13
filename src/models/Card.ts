import { Schema, model, InferSchemaType } from 'mongoose'
type Card = InferSchemaType<typeof Schema>

const cardSchema = new Schema<Card>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
        unique: true,
        required: true
    },
    PIN: {
        type: Number,
        required: true,
        unique: true,
        maximum: 4
    },
    name: {
        type: String
    },
    cvv: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: { value: ["Verve", "MasterCard", "Visa"] },
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: { value: ["active", "expired", "blocked"] },
    },
    OTP: Number
  },
  { timestamps: true, strict: true }
)

export const Card = model("Card", cardSchema)

