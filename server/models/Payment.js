import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    stripeId: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
})

const PaymentModel = mongoose.model("Payment", PaymentSchema);
export default PaymentModel;