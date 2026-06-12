import express from 'express';
import pool from '../utils/db.js';
import { index, show } from '../controllers/products.js';
import { validateProductBody } from '../middlewares/products.js';
import { validateId } from '../middlewares/validateId.js';
// importazione controllers

// importazione middlewares

// impostazione router

const router = express.Router();

// rotta index
router.get('/', [ index]);

// rotta show

router.get('/:id', [validateId, show]);



export default router;