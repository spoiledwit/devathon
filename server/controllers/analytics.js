import TicketModel from "../models/Ticket.js";
import EventModel from "../models/Event.js";
import PaymentModel from "../models/Payment.js";
import AuthModel from "../models/Auth.js";

export const stats = async (req, res) => {
  try {
    const users = await AuthModel.find();
    const payments = await PaymentModel.find();
    const tickets = await TicketModel.find();
    const events = await EventModel.find();
    const newUsers = await AuthModel.find({
      createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({ users, payments, tickets, events, newUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAgentStats = async (req, res) => {
  try {
    const events = await EventModel.find({ agentId: req.userId });
    // finding all the tickets for the events
    const eventIds = events.map((event) => event._id);
    const tickets = await TicketModel.find({ eventId: { $in: eventIds } });
    // finding all the payments for the tickets
    const ticketIds = tickets.map((ticket) => ticket._id);
    const payments = await PaymentModel.find({ ticketId: { $in: ticketIds } });
    res.status(200).json({ payments, tickets, events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
