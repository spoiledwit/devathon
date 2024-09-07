import {
    getNotifications,
    readNotifications
} from "../controllers/notification.js"

import express from "express";

const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";

router.get("/", verifyToken, getNotifications);
router.put("/read", verifyToken, readNotifications);

export default router;