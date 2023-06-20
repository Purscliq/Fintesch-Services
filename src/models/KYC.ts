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
    otherName: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        // required: true,
      },
      BVN: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        // required: true
    },
    gender: {
      type: String,
      // required: true
    },
    nationality: {
        type: String,
        // required: true
    },
    idType: {
        type: String,
        // required: true,
    },
    idNumber: {
        type: Number,
        // required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        // required: true
    },
    expiryDate: {
        type: Date,
        // required: true
    },
    dateOfBirth: {
      type: String,
    },
    OTP: {
        type: Number
    },
    status: {
        type: Boolean,
        default: false
      }, 
  },

  { timestamps : true, strict: true }
)

export const KYC = model("KYC", KYCSchema)

