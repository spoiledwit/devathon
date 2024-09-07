import {
    createEvent,
    getEvents,
    getEventById,
    getAgentEvents
} from '../controllers/event.js';

import express from 'express';

const router = express.Router();

import verifyToken from '../middlewares/verifyToken.js';
import { isAgent } from '../middlewares/isAgent.js';

router.get('/agent/events', verifyToken, isAgent, getAgentEvents);

router.post('/event', createEvent);
router.get('/events', getEvents);
router.get('/event/:id', getEventById);

export default router;