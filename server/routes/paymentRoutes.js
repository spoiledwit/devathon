import { initializePayment, handlePaymentSuccess, getPayments } from "../controllers/Payment.js";
import verifyToken from "../middlewares/verifyToken.js";
import express from "express";

import { isAgent } from "../middlewares/isAgent.js";

const router = express.Router();

router.get("/", verifyToken, isAgent, getPayments);
router.post("/stripe", verifyToken, initializePayment);
router.get("/success", handlePaymentSuccess);
router.get("/cancel", (req, res) => {
    res.send("Payment cancelled");
}
);


export default router;