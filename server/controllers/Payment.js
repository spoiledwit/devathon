import dotenv from "dotenv";
import { stripe } from "../stripe.js";

dotenv.config();

export const initializePayment = async (req, res) => {
 
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: "TEST TITLE",
              // images: ["TEST URL"],
            },
            unit_amount: 10000 * 100 // test price = 10 PKR
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BACKEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        id: "test id", // You can add any custom data here
        userId: "user1" // User ID
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
     const id = session.metadata.id;
      const userId = session.metadata.userId;

      console.log(id);
      console.log(userId);

      // do anything you want with the data on success

      // Create a new Payment
      // amount: session.amount_total / 100,
      //   stripeId: session_id,
     
     

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