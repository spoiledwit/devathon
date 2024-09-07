import AuthModel from "../models/Auth.js";
import EventModel from "../models/Event.js";

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
      agentId,
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
    const events = await EventModel.find();

    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id);
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
