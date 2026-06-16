import express from 'express';

const router = express.Router();

// rotta index con parametro ricerca
router.get('/', [ index]);

export default router;