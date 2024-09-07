import {
    createEvent,
    getEvents,
    getEventById,
    getAgentEvents,
    updateEvent,
    deleteEvent,
    postponeEvent,
    getEventsByCategory
} from '../controllers/event.js';

import express from 'express';

const router = express.Router();

import verifyToken from '../middlewares/verifyToken.js';
import { isAgent } from '../middlewares/isAgent.js';

router.get('/agent', verifyToken, isAgent, getAgentEvents);
router.post('/', verifyToken, isAgent, createEvent);
router.put('/postpone/:id', verifyToken, isAgent, postponeEvent);
router.get('/category/:categoryName', getEventsByCategory)
router.put('/:id', verifyToken, isAgent, updateEvent);
router.get('/all', getEvents);
router.get('/:id', getEventById);
router.delete('/:id', verifyToken, isAgent, deleteEvent);

export default router;