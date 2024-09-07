import {
    stats,
    getAgentStats
} from "../controllers/analytics.js";

import express from "express";

const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAgent } from "../middlewares/isAgent.js";

router.get("/admin", verifyToken, isAdmin, stats);
router.get("/agent", verifyToken, isAgent, getAgentStats);

export default router;