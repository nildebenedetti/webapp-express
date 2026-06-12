// import connection from database
import pool from '../utils/db.js';
import { normalizeProduct } from '../utils/functions.js';

async function index(request, response) {
    const querySelectAll = 'select * from `products`';

    try {
        const [rows] = await pool.query(querySelectAll);
        const normalizedProducts = rows.map(normalizeProduct);

        response.json({
            error: null,
            results: normalizedProducts
        });
    } catch (error) {
        console.error("errore durante l'import del catalogo prodotti", error.message)
        response.status(500).json({
            error: 'errore interno del server nel recupero del catalogo prodotti',
            results: null
        })
    }
}

async function show(request, response) {
    const realId = request.realId;
    const querySelectById = 'SELECT * FROM `products` WHERE id = ?';
    
    try {
        const [rows] = await pool.query(
            querySelectById, [realId]
        );
        // recupero prodotto grezzo
        const rawProduct = rows[0];
        // creo oggetto con prodotto normalizzato
        const normalizedProduct = normalizeProduct(rawProduct);
        response.status(200)
            .json({ error: null, results: normalizedProduct });
    } catch (error) {
        console.error("errore durante il recupero del prodotto", error.message);
        response.status(500)
            .json({
                error: 'errore interno del server nel recupero del prodotto',
                results: null
            });
        return;
    }
}

export { index, show };