import { Schema, model, InferSchemaType } from 'mongoose'
type KYC = InferSchemaType<typeof Schema>

const KYCSchema = new Schema<KYC>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    otherNames: {
        type: String,
        trim: true,
        default: ""
    },
    phoneNumber: {
        type: String,
        unique: true
      },
    BVN: {
        type: String,
        unique: true,
        required: true
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String 
    },
    address: {
        type: String
    },
    postalCode: {
        type: String
    },
    gender: {
      type: String
    },
    nationality: {
        type: String
    },
    idType: {
        type: String,
    },
    idNumber: {
        type: Number,
        // required: true,
        unique: true
    },
    expiryDate: {
        type: Date,
        // required: true
    },
    DOB: {
      type: String
    },
    OTP: {
        type: Number
    },
    status: {
        type: String,
        enum: {
            values: ["active", "inactive"], 
            message: "{values} not supported"
        },
        default: 'inactive'
      }, 
  },

  { timestamps : true, strict: true }
)

export const KYC = model("KYC", KYCSchema)

