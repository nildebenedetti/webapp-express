import express from 'express';
import pool from './utils/db.js';

const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(express.static('public')); // middleware per static files
app.use(express.json());// middleware interprete

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


app.listen(port, (error) => {
    if (error) {
        console.error('Il server ha riscontrato un problema');
    } else {
        console.log(`Server in ascolto porta ${port}`);
    }
});
