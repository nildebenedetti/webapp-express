import express from 'express';
import { index } from '../controllers/categoriesController.js';

// creo il router per le categorie
const categoriesRouter = express.Router();

// rotta GET per ottenere tutte le categorie
categoriesRouter.get('/categories', index);

export default categoriesRouter;