import express from 'express';
import pool from '../utils/db.js';

const router = express.Router();

// GET /products
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Errore nella query ' + error.message);
  }
});

export default router;