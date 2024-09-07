import TicketModel from "../models/Ticket.js";

// Create Ticket
export const createTicket = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        const ticket = await TicketModel.create({
            eventId,
            userId,
        });

        res.status(201).json({ ticket });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Ticket by ID
export const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await TicketModel.findById(id);
        res.status(200).json({ ticket });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Ticket
export const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { eventId, userId } = req.body;

        const ticket = await TicketModel.findByIdAndUpdate(id, { eventId, userId }, { new: true });

        res.status(200).json({ ticket });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get Tickets of a User
export const getUserTickets = async (req, res) => {
    try {
        const { userId } = req.params;

        const tickets = await TicketModel.find({ userId });

        res.status(200).json({ tickets });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get Tickets of an Event
export const getEventTickets = async (req, res) => {
    try {
        const { eventId } = req.params;

        const tickets = await TicketModel.find({ eventId });

        res.status(200).json({ tickets });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Approve Ticket
export const approveTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await TicketModel.findByIdAndUpdate(id, { status: "approved" }, { new: true });

        res.status(200).json({ ticket });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Reject Ticket
export const rejectTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await TicketModel.findByIdAndUpdate(id, { status: "rejected" }, { new: true });

        res.status(200).json({ ticket });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

