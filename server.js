import express from 'express';
import categoriesRouter from './routers/categoriesRouter.js';
// import middleware
import pool from './utils/db.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(express.static('public')); // middleware per static files
app.use(express.json());// middleware interprete

app.use(categoriesRouter);
import productsRouter from './routers/products.js';
app.use('/products', productsRouter);

// test: stampo i prodotti nel terminal
const [rows] = await pool.query('SELECT * FROM products');
console.log(rows);


app.get('/', (request, response) => {
    response
        .type('html')
        .send('<h1>Express blog Routing</h1>')
})

app.use(errorHandler);
app.use(errorHandler);

app.listen(port, (error) => {
    if (error) {
        console.error('Il server ha riscontrato un problema');
    } else {
        console.log(`Server in ascolto porta ${port}`);
    }
});
