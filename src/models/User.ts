import { Schema, model, InferSchemaType } from 'mongoose'
import validator from 'validator'

type User = InferSchemaType<typeof Schema>

const userSchema = new Schema<User>({
    data: {
      type: Schema.Types.ObjectId,
      ref: "KYC",
      unique: true,
    },
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
      minlength: [6, "Minimum password character is 6"]
    },
    role: {
      type: String,
      enum: { values: ['Individual', 'Business', 'Admin'], message: '{VALUE} is not supported' },
      default: 'Individual'
    },
    OTP: Number,
    status: {
        type: Boolean,
        default: false
      }, 
  },

  { timestamps : true, strict: true }
)

export const User = model("User", userSchema)

