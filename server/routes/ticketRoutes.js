import {
    getEventTickets,
    getTicketById,
    createTicket,
    getUserTickets,
    updateTicket,
} from "../controllers/ticket.js";

import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAgent } from "../middlewares/isAgent.js";

const router = express.Router();

router.get("/user", verifyToken, getUserTickets);
router.get("/event/:eventId", getEventTickets);
router.get("/:id", getTicketById);
router.post("/", verifyToken, isAgent, createTicket);
router.put("/:id", verifyToken, isAdmin, updateTicket);

export default router;