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
        const newUsers = await AuthModel.find({ createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });

        res.status(200).json({ users, payments, tickets, events, newUsers });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}