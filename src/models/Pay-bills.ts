import { Schema, model, InferSchemaType } from 'mongoose'
type Bills = InferSchemaType<typeof Schema>

const BillSchema = new Schema<Bills>(
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
                values: ['Electricity', 'Cable-tv'], 
                message: '{VALUE} is not supported' 
            }
        },

        code: String,
        message: String,
        payment_data: {
            meter_number: String,
            electricity: String,
            token: String,
            units: String,
            amount: String,
            amount_charged: String,
            order_id: String
        },
    },

    {timestamps: true}
)

export const Bills = model("PayBills", BillSchema);