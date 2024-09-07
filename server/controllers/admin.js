import TicketModel from "../models/Ticket.js";
import EventModel from "../models/Event.js";
import PaymentModel from "../models/Payment.js";
import AuthModel from "../models/Auth.js";

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await AuthModel.find();
        res.status(200).json({ users });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Payments
export const getAllPayments = async (req, res) => {
    try {
        const payments = await PaymentModel.find();
        res.status(200).json({ payments });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Tickets
export const getAllTickets = async (req, res) => {
    try {
        const tickets = await TicketModel.find();
        res.status(200).json({ tickets });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Events
export const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.find();
        res.status(200).json({ events });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await AuthModel.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};