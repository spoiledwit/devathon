import {
    getAllEvents,
    getAllPayments,
    getAllTickets,
    getAllUsers,
    deleteUser
} from "../controllers/admin.js"

import { isAdmin } from "../middlewares/isAdmin"

import express from "express"

const router = express.Router();

router.get("/users", isAdmin, getAllUsers);
router.get("/payments", isAdmin, getAllPayments);
router.get("/tickets", isAdmin, getAllTickets);
router.get("/events", isAdmin, getAllEvents);
router.delete("/user/:id", isAdmin, deleteUser);

export default router;