import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    content: {
        text: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    isRead: { type: Boolean, default: false },
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);
export default Message;