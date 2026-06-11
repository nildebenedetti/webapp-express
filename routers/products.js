import express from 'express';
import pool from '../utils/db.js';
import { index } from '../controllers/products.js';

// importazione controllers

// importazione middlewares

// impostazione router

const router = express.Router();

// rotta index
router.get('/', index);

// rotta show
export default router;