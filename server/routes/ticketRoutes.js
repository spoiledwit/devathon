import {
    getEventTickets,
    getTicketById,
    createTicket,
    getUserTickets,
    updateTicket,
    getAgentTickets,
    getAllTickets,
    verifyTicket
} from "../controllers/ticket.js";

import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAgent } from "../middlewares/isAgent.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllTickets);
router.get("/agent", verifyToken, isAgent, getAgentTickets);
router.get("/user", verifyToken, getUserTickets);
router.get("/event/:eventId", getEventTickets);
router.get("/:id", getTicketById);
router.post("/", verifyToken, createTicket);
router.post("/verify/:id", verifyToken, verifyTicket);

export default router;