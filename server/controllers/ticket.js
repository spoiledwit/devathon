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
            code: Math.random().toString(36).substring(7),
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

        console.log(ticket);
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
        const tickets = await TicketModel.find({ userId: req.userId }).populate("eventId", "title description eventDate images location").populate("userId", "name email");
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

export const verifyTicket = async (req, res) => {
    try {
        const { code } = req.body;
        const { id } = req.params;

        const ticket = await TicketModel.findById(id)

        console.log(ticket);

        if (ticket.code === code) {
            ticket.status = "approved";
            await ticket.save();
            res.status(200).json({ ticket });
        } else {
            res.status(400).json({ error: "Invalid code" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}