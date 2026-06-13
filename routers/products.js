import express from 'express';
import pool from '../utils/db.js';
import { index, show, featured, showProductAvgStarRating } from '../controllers/products.js';
import { validateProductBody } from '../middlewares/products.js';
import { validateId } from '../middlewares/validateId.js';
// importazione controllers

// importazione middlewares

// impostazione router

const router = express.Router();

// rotta index con parametro ricerca
router.get('/', [ index]);

// rottta product featured
router.get('/featured', [validateId, featured]);

// rotta show 

router.get('/:id', [validateId, show]);

// rotta custom per fetch star rating average
router.get('/avgRating/:id', [validateId, showProductAvgStarRating]);





export default router;