import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    price: {
        type: Number,
        required: true
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    region: {
        type: String,
        required: true
    },
})

const EventModel = mongoose.model("Event", EventSchema);
export default EventModel;