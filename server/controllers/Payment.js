import dotenv from "dotenv";
import { stripe } from "../stripe.js";
import PaymentModel from "../models/Payment.js";
import TicketModel from "../models/Ticket.js";

dotenv.config();

export const initializePayment = async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await TicketModel.findById(ticketId).populate("eventId");

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const amount = ticket.eventId.price;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: ticket.eventId.title,
              // images: ["TEST URL"],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BACKEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        amount,
        ticketId
      },
    });
    res.json(session);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const ticketId = session.metadata.ticketId;
      const amount = session.metadata.amount;

      const payment = await PaymentModel.create({
        paymentDate: new Date(),
        paymentStatus: "approved",
        amount,
        ticketId,
      });

      await TicketModel.findByIdAndUpdate(ticketId, {
        paymentId: payment._id,
      })

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