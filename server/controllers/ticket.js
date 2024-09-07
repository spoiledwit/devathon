import TicketModel from "../models/Ticket.js";
import { initializePayment } from "./Payment.js";
import EventModel from "../models/Event.js";
import PaymentModel from "../models/Payment.js";

// Create Ticket
export const createTicket = async (req, res) => {
    try {
        const userId = req.userId;
        const { eventId } = req.body;
        const event = await EventModel.findById(eventId);
        const ticket = await TicketModel.create({
            eventId,
            userId,
        });
        const payment = await PaymentModel.create({
            ticketId: ticket._id,
            amount: event.price,
            paymentDate: new Date(),
            paymentStatus: "pending",
            stripeId: "",
        });
        ticket.paymentId = payment._id;
        await ticket.save();
        const response = await initializePayment(ticket, event);
        res.status(201).json({ ticket, session: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

// Get Ticket by ID
export const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await TicketModel.findById(id);
        res.status(200).json({ ticket });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Ticket
export const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { eventId, userId } = req.body;

        const ticket = await TicketModel.findByIdAndUpdate(
            id,
            { eventId, userId },
            { new: true }
        );

        res.status(200).json({ ticket });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Tickets of a User
export const getUserTickets = async (req, res) => {
    try {
        const { userId } = req.params;

        const tickets = await TicketModel.find({ userId });

        res.status(200).json({ tickets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Tickets of an Event
export const getEventTickets = async (req, res) => {
    try {
        const { eventId } = req.params;

        const tickets = await TicketModel.find({ eventId });

        res.status(200).json({ tickets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Approve Ticket
export const approveTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await TicketModel.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );

        res.status(200).json({ ticket });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Reject Ticket
export const rejectTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await TicketModel.findByIdAndUpdate(
            id,
            { status: "rejected" },
            { new: true }
        );

        res.status(200).json({ ticket });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAgentTickets = async (req, res) => {
    try {
        const userId = req.userId;

        const events = await EventModel.find({ agentId: userId });

        const eventIds = events.map((event) => event._id);

        const tickets = await TicketModel.find({ eventId: { $in: eventIds } });

        res.status(200).json({ tickets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await TicketModel.find().populate("eventId").populate("userId");
        res.status(200).json({ tickets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};