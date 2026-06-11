import express from 'express';
import pool from '../utils/db.js';
import { index, show } from '../controllers/products.js';

// importazione controllers

// importazione middlewares

// impostazione router

const router = express.Router();

// rotta index
router.get('', index);

// rotta show
router.get('/:id', show);

export default router;