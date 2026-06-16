import express from 'express';
import { chat } from '../controllers/aiagentController.js';

const router = express.Router();

// rotta index con parametro ricerca
router.post('/chat', [ chat]);

export default router;