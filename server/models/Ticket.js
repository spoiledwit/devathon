import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
    },
})

const TicketModel = mongoose.model("Ticket", TicketSchema);
export default TicketModel;