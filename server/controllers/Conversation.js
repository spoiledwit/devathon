import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { userSockets } from "../socket.js";
import Notification from "../models/Notification.js";
import AuthModel from "../models/Auth.js";
import EventModel from "../models/Event.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.body.id;
    const eventObk = await EventModel.findById(eventId);
    const agentId = eventObk.agentId;
    const members = [userId, agentId];
    if (!members) {
      return res.status(400).json("Members are required");
    }
    const oldConversation = await Conversation.findOne({
      members: { $all: members },
    });
    if (oldConversation) {
      return res.status(200).json(oldConversation);
    }
    const conversation = new Conversation({ members });
    await conversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.userId;
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    }).populate("members lastMessage");
    res.status(200).json(conversation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate("members lastMessage")
      .sort({ updatedAt: -1 });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { contentType, text, image } = req.body;
    if (!id) {
      return res.status(400).json("Conversation ID is required");
    }
    if (!contentType) {
      return res.status(400).json("Content type is required");
    }
    const newMessage = new Message({
      conversationId: id,
      sender: req.userId,
      content: { contentType, text, image },
    });
    await newMessage.save();

    const conversation = await Conversation.findById(id);
    conversation.lastMessage = newMessage;
    await conversation.save();

    const { getIo } = await import("../socket.js");
    const io = getIo();
    const socketId =
      userSockets[conversation.members.find((member) => member !== req.userId)];
    
    if (socketId) {
      io.to(socketId).emit("chatNotify", {
        title: "New Message",
        description: "You have a new message",
      });
    } else {
      const notification = new Notification({
        title: "New Message",
        description: "You have a new message",
        userId: conversation.members.find((member) => member !== req.userId),
      });
      await notification.save();
      const user = await AuthModel.findById(
        conversation.members.find((member) => member !== req.userId)
      );
      user.notifications.push(notification);
      await user.save();
    }
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ conversationId: id });
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const userId = req.userId;
   
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    }).populate("members lastMessage");
   
    res.status(200).json(conversations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
