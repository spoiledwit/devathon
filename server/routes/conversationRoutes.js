import { getConversation, sendMessage, getMessages, getMyConversations, createConversation } from "../controllers/Conversation.js";
import verifyToken from "../middlewares/verifyToken.js";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, getConversation);
router.get("/my", verifyToken, getMyConversations);
router.post("/:id", verifyToken, sendMessage);
router.get("/:id/messages", verifyToken, getMessages);
router.post("/", verifyToken, createConversation);

export default router;