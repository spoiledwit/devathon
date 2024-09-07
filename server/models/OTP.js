import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    }
})

const OTPModel = mongoose.model("OTP", OTPSchema);
export default OTPModel;