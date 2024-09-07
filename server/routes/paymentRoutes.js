import { initializePayment, handlePaymentSuccess } from "../controllers/Payment.js";
import verifyToken from "../middlewares/verifyToken.js";
import express from "express";

const router = express.Router();

router.post("/stripe", verifyToken, initializePayment);
router.get("/success", handlePaymentSuccess);
router.get("/cancel", (req, res) => {
    res.send("Payment cancelled");
    }
);


export default router;