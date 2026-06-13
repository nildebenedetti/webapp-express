// import connection from database
import pool from '../utils/db.js';
import { normalizeProduct } from '../utils/functions.js';
import { querySelectProductBySearchString, querySelectProductStarRatingById } from '../utils/queries.js';

async function index(request, response) {
    const userInput = request.query.search
        ? request.query.search.toLowerCase().trim()
        : undefined;
    const searchParamFormatted = `%${userInput}%`;

    const querySelectAll = 'select * from `products`';

    if (userInput) {
        try {
            const [rows] = await pool.execute(
                querySelectProductBySearchString, [searchParamFormatted, searchParamFormatted, searchParamFormatted, searchParamFormatted]
            );

            response.status(200)
                .json({
                    error: null,
                    results: rows
                });

        } catch (error) {
            response.status(500)
                .json({
                    error: `errore interno del server nella ricerca dei prodotti`,
                    results: null
                });
        }

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



async function showProductAvgStarRating(request, response) {
    const realId = request.realId;

    try {
        const [rows] = await pool.execute(
            querySelectStarRatingById, [realId]
        );

        response.status(200)
            .json({
                error: null,
                results: rows
            });
    } catch (error) {
        response.status(500)
            .json({
                error: `errore interno del server nella fetch del dato Average Rating per prodotto con id ${realId}`,
                results: null
            });
    }


};

async function showProductbySearchString(request, response) {
    const userInput = request.params.search();
    const searchParamFormatted = '%userInput%'

    try {
        const [rows] = await pool.execute(
            querySelectProductBySearchString, [userInput]
        );

        response.status(200)
            .json({
                error: null,
                results: rows
            });

    } catch (error) {
        response.status(500)
            .json({
                error: `errore interno del server nella ricerca dei prodotti`,
                results: null
            });
    }
}

async function featured(request, response) {
    const querySelectFeaturedProducts = `select p.*
    from products p 
    order by updated_at desc
    limit 5;`;

    try {
        const [rows] = await pool.query(querySelectFeaturedProducts);
        const normalizedProducts = rows.map(normalizeProduct);

        response.json({
            error: null,
            results: normalizedProducts
        });
    } catch (error) {
        console.error("errore durante l'import dei prodotti featured", error.message)
        response.status(500).json({
            error: 'errore interno del server nel recupero dei prodotti featured',
            results: null
        });
    }
}

export { index, show, showProductAvgStarRating, featured };