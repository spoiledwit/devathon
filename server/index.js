import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { initSocket } from "./socket.js";
import { createServer } from "http";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRouts from "./routes/eventRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "*", // using only for the development purpose
  })
);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB connected");
});

db.on("error", (error) => {
  console.log(error);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/event", eventRouts);
app.use("/otp", otpRoutes);
app.use("/ticket", ticketRoutes);
app.use("/conversation", conversationRoutes);
app.use("/notification", notificationRoutes);

app.use("/moderate", async (req, res)=>{
  const { text } = req.body;
  const isSafe = await moderateContent(text);
  res.json({ isSafe });
})

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
