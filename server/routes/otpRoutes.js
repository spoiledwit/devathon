import {
    generateOTP,
    verifyOTP
} from "../controllers/otp.js";

import express from "express";

const router = express.Router();

router.post("/generate", generateOTP);
router.post("/verify", verifyOTP);

export default router;