import { Schema, model, InferSchemaType } from 'mongoose'
import validator from 'validator'

type User = InferSchemaType<typeof Schema>

const userSchema = new Schema<User>({
  // SIGN UP DATA
    email: {
      type: String,
      required: [true, "This field is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [ validator.isEmail, "invalid Email address" ],
    },
    password: {
      type: String,
      required: [true, "This field is required"],
      trim: true,
      minlength: [6, "Minimun password character is 6"]
    },
    role: {
      type: String,
      enum: { values: ['User','Admin'], message: '{VALUE} is not supported' },
      default: 'User'
    },
  // KYC DATA
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: Number,
      unique: true,
      minimum: [5, "Phone number is too short"],
      maximum: [15, "Phone number is too long"]
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    DOB: {
      type: Date
    },
    KycVerified: {
      type: Boolean,
      default: false
    },
  // AFTER ACCOUNT OPENING
    referralCode: {
      type: Number,
      unique: true,
      minimum: 6,
      maximum: 6
    },
    referredBy: {
      type: String
    },
    OTP: Number,
    verified: {
        type: Boolean,
        default: false
      }, 
  },

  { timestamps : true, strict: true }
)

export const User = model("User", userSchema)

