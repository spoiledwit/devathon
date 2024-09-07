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

const router = express.Router();

router.get("/user", verifyToken, getUserTickets);
router.get("/event/:eventId", getEventTickets);
router.get("/:id", getTicketById);
router.post("/", verifyToken, createTicket);

export default router;