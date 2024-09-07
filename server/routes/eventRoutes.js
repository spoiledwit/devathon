import {
    createEvent,
    getEvents,
    getEventById,
    getUserEvents,
} from '../controllers/event.js';

import express from 'express';

const router = express.Router();

router.post('/event', createEvent);
router.get('/events', getEvents);
router.get('/event/:id', getEventById);