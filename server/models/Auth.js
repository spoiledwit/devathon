import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "agent"],
    default: "user",
  },
  revenue: {
    type: Number,
    default: 0,
  },
  notifications: {
    type: Array,
    default: [],
  },
  MFA: {
    type: Boolean,
    default: false,
  },

  mfaCode: {
    type: String,
    default: null,
  },
  mfaCodeExpiry: {
    type: Date,
    default: null,
  },
});

const AuthModel = mongoose.model("Auth", AuthSchema);
export default AuthModel;
