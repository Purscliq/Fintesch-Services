import { Schema, model, InferSchemaType } from 'mongoose'
type TopUp = InferSchemaType<typeof Schema>

const TopUpSchema = new Schema<TopUp>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true
        },

        type: {
            type: String,
            enum: { 
                values: ['airtime top up', 'data top up'], 
                message: '{VALUE} is not supported' 
            }
        },

        code: String,
        message: String,
        payment_data: {
            "network": String,
            "phone": String,
            "amount": String,
            "order_id": String,
            "data_plan": String
        }
    },
    
    {timestamps: true}
)

export const TopUp = model("TopUp", TopUpSchema);