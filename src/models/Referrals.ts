import { Schema, model, InferSchemaType } from 'mongoose';
type Referral = InferSchemaType<typeof Schema>;

const referralSchema = new Schema({
    user_Id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },

    referral_Id: {
        type: String,
        required: true,
        unique: true
    },

    no_Of_Referrals: {
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

export const Referral = model("referrals", referralSchema);