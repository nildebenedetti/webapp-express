import express from 'express';
import { index, show } from '../controllers/categoriesController.js';
import { validateCategoryBody } from '../middlewares/categoriesMiddlewares.js';
import { validateId } from '../middlewares/validateId.js';


// creo il router per le categorie

const router = express.Router();

// rotta index
router.get('/', [ index]);

// rotta show

router.get('/:id', [validateId, validateCategoryBody, show]);


export default router;