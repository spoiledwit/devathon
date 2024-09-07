import dotenv from "dotenv";
import { stripe } from "../stripe.js";
import PaymentModel from "../models/Payment.js";
import AuthModel from "../models/Auth.js";

dotenv.config();

export const initializePayment = async (ticket, event) => {
  const amount = event.price;
  console.log(ticket);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: event.title,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.BACKEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    metadata: {
      amount,
      ticketId: ticket._id.toString(),
    },
  });
  return session;
};

export const handlePaymentSuccess = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {

      const ticketId = session.metadata.ticketId;
      const amount = session.metadata.amount;

      const onePercent = amount / 100;

      const admin = await AuthModel.findOne({ role: "admin" });
      admin.revenue += onePercent;
      await admin.save();

      await PaymentModel.findOneAndUpdate(
        { ticketId },
        {
          paymentDate: new Date(),
          paymentStatus: "approved",
          stripeId: session.payment_intent,
          amount,
        },
        { new: true }
      );

      res.redirect(`${process.env.FRONTEND_URL}`);
    } else {
      res.status(400).send("Payment not completed");
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handlePaymentFailure = async (req, res) => {
  res.status(400).send("Payment failed");
};
