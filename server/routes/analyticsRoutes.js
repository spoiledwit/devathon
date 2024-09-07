import {
    stats
} from "../controllers/analytics.js";

import express from "express";

const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

router.get("/admin", verifyToken, isAdmin, stats);

export default router;