import EventModel from "../models/Event.js";

// Create Event
export const createEvent = async (req, res) => {
    try {
        const { title, eventDate, description, location, category, images, price, agentId, region } = req.body;

        const event = await EventModel.create({
            title,
            eventDate,
            description,
            location,
            category,
            images,
            price,
            agentId,
            region,
        });

        res.status(201).json({ event });
    } catch (err) {
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Event
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, eventDate, description, location, category, images, price, agentId, region } = req.body;

        const event = await EventModel.findByIdAndUpdate(id, { title, eventDate, description, location, category, images, price, agentId, region }, { new: true });

        res.status(200).json({ event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Delete Event
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        await EventModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};