import { Schema, model, InferSchemaType } from 'mongoose'
type Card = InferSchemaType<typeof Schema>

const cardSchema = new Schema<Card>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    accountID: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        unique: true,
        required: true
    },
    PIN: {
        type: Number,
        required: true,
        unique: true,
        maximum: 4
    },
    cardName: {
        type: String,
        required: true,
        unique: true
    },
    cvv: {
        type: Number,
        required: true,
        unique: true
    },
    cardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    cardType: {
        type: String,
        required: true,
        enum: { value: ["Verve", "MasterCard", "Visa"] },
        default: "Verve"
    },
    OTP: Number,
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: { value: ["active", "expired", "blocked"] },
        default: "active"
    }
  },
  { timestamps: true, strict: true }
)

export const Card = model("Card", cardSchema)

