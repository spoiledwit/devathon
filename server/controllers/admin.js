import TicketModel from "../models/Ticket.js";
import EventModel from "../models/Event.js";
import PaymentModel from "../models/Payment.js";
import AuthModel from "../models/Auth.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await AuthModel.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentModel.find();
    res.status(200).json({ payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find();
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await AuthModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Make User an Agent
export const makeAgent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthModel.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new AuthModel({
      name,
      email,
      hashedPassword,
      role: "agent",
    });

    await newUser.save();

    res.status(200).json({ message: "User is now an agent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const user = await AuthModel.findById(id);
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};