import { Schema, model, InferSchemaType } from 'mongoose'
type Referral = InferSchemaType<typeof Schema>

const referralSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    referralID: {
        type: String,
        required: true,
        unique: true
    },
    noOfReferrals: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Number,
        default: 0.00
    }
},
    { timestamps: true }
)

export const Referral = model("referrals", referralSchema)