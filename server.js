import express from 'express';
import pool from './utils/db.js';
import cors from 'cors';
import categoriesRouter from './routers/categoriesRouter.js';
import reviewsRouter from "./routers/reviews.js";
import productsRouter from './routers/products.js';
import { validateId } from './middlewares/validateId.js';
import { claudeChat } from './utils/claudeChat.js';

// import middleware
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';


const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(express.static('public')); // middleware per static files
app.use(cors());
app.use(express.json());// middleware interprete

app.use("/reviews", reviewsRouter);

app.use("/categories", categoriesRouter);

app.use('/products', productsRouter);


// test: stampo i prodotti nel terminal
/* const [rows] = await pool.query('SELECT * FROM products');
console.log(rows); */


app.get('/', (request, response) => {
    response
        .type('html')
        .send('<h1>Express blog Routing</h1>')
})

app.use(errorHandler);


app.listen(port, (error) => {
    if (error) {
        console.error('Il server ha riscontrato un problema');
    } else {
        console.log(`Server in ascolto porta ${port}`);
    }
    // SCOMMENTA PER TEST CHAT claudeChat();
});
