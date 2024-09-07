import {
    stats
} from "../controllers/analytics.js";

import express from "express";

const router = express.Router();

router.get("/stats", stats);

export default router;