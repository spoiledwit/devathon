import AuthModel from "../models/Auth.js";
import EventModel from "../models/Event.js";
import { sendEmail } from "../utils/sendEmail.js";
import TicketModel from "../models/Ticket.js";

// Create Event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      eventDate,
      description,
      location,
      category,
      images,
      price,
      region,
    } = req.body;
    const userId = req.userId;
    const event = await EventModel.create({
      title,
      eventDate,
      description,
      location,
      category,
      images,
      price,
      agentId: userId,
      region,
    });

    res.status(201).json({ event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all Events
export const getEvents = async (req, res) => {
  try {
    // get region, startingDate, and endingDate from query params
    const { region, startingDate, endingDate } = req.query;

    // Create query object
    let query = {};

    // Check if region is provided
    if (region) {
      query.region = { $regex: region, $options: "i" };
    }

    // Check if both startingDate and endingDate are provided
    if (startingDate && endingDate) {
      query.eventDate = {
        $gte: new Date(startingDate), // Greater than or equal to the starting date
        $lte: new Date(endingDate), // Less than or equal to the ending date
      };
    }

    // Fetch events based on the query
    const events = await EventModel.find(query).populate("agentId", "name");

    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventModel.findById(id).populate("agentId", "name");
    res.status(200).json({ event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const {
      title,
      eventDate,
      description,
      location,
      category,
      images,
      price,
      region,
    } = req.body;

    const event = await EventModel.findById(id);

    if (event.agentId.toString() !== userId) {
      console.log(event.agentId);
      return res.status(400).json({ error: "Access denied" });
    }

    // checking if postponed
    if (event.eventDate !== eventDate) {
      postponeEvent(id);
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      {
        title,
        eventDate,
        description,
        location,
        category,
        images,
        price,
        region,
      },
      { new: true }
    );

    res.status(200).json({ event: updatedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;

    const userObj = await AuthModel.findById(user);
    const event = await EventModel.findById(id);

    if (event.agentId.toString() !== user && userObj.role !== "admin") {
      return res.status(400).json({ error: "Access denied" });
    }

    await EventModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAgentEvents = async (req, res) => {
  try {
    const userId = req.userId;

    const events = await EventModel.find({ agentId: userId });

    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postponeEvent = async (id) => {
  const tickets = await TicketModel.find({ eventId: id }).populate(
    "userId",
    "email"
  ).populate("eventId", "title");
  tickets.forEach(async (ticket) => {
    await sendEmail({
      email: ticket.userId.email,
      subject: "Event Postponed",
      text: `The event ${ticket.event.title} has been postponed.`,
    });
  });
};
