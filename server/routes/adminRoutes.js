import {
    getAllEvents,
    getAllPayments,
    getAllTickets,
    getAllUsers,
    deleteUser,
    makeAgent,
    updateUser
} from "../controllers/admin.js"

import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js"

import express from "express"

const router = express.Router();

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/payments", verifyToken, isAdmin, getAllPayments);
router.get("/tickets", verifyToken, isAdmin, getAllTickets);
router.get("/events", verifyToken, isAdmin, getAllEvents);
router.post("/agent", verifyToken, isAdmin, makeAgent);
router.delete("/user/:id", verifyToken, isAdmin, deleteUser);
router.put("/user/:id", verifyToken, isAdmin, updateUser);

export default router;