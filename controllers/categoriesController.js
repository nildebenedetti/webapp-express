import pool from '../utils/db.js';
import { normalizeProduct } from '../utils/functions.js';

// funzione che gestisce la richiesta GET per ottenere tutte le categorie
const index = async (request, response) => {

    const querySelectAllCategoriesandProducts = `    SELECT 
    c.id as category_id, c.name AS category_name, c.category_type as category_type, c.short_description AS category_short_description, c.marketing_description as category_marketing_description, p.id AS product_id, p.name as product_name, p.short_description as product_short_description, p.marketing_description as product_marketing_description, p.ingredients, p.allergens, p.availability, p.price , p.image_url as imageUrl
    FROM categories c
    LEFT JOIN category_product cp ON c.id = cp.category_id
    LEFT JOIN products p ON p.id = cp.product_id`;


    try {
        // eseguo la query per ottenere tutte le categorie dal database
        const [rows] = await pool.query(querySelectAllCategoriesandProducts);
        let productsWithCategories = [];
        let currentProduct = null;
        for (let i = 0; i < rows.length; i++) {
            const currentRow = rows[i]; //ciclo le righe, che sono OGGETTI
            const {
                category_id: categoryId,
                category_type: categoryType,
                category_name: categoryName,
                category_marketing_description: categoryMktgDescritpion,
                category_short_description: categoryShortDescription,
                product_id: productId,
                product_name: productName,
                image_url: imageUrl,
                product_short_description: productShortDescription,
                product_marketing_description: productMktgDescription,
                ingredients,
                allergens,
                price,
                availability
            } = currentRow;
            // devo fare la find per trovare currentProduct
            const existingProduct = productsWithCategories.find(product => product.productId === productId);
            // se il prodotto non c'è in array
            // come trovo il prodotto da rows[i]??????
            if (!existingProduct) {
                // devo scrivere la variabile categories
                const categories = [{
                    categoryId,
                    categoryName,
                    categoryType,
                    categoryMktgDescritpion,
                    categoryShortDescription
                }]; // mi creo il mio arrray di categories
                // poi mi scrivo il mio prodotto
                currentProduct = {
                    productId,
                    productName,
                    imageUrl,
                    categories,
                    productShortDescription,
                    productMktgDescription, ingredients,
                    allergens,
                    availability
                }

                productsWithCategories.push(currentProduct);

            } else if (existingProduct) {
                // ALLORA DEVO SOLO PUSHARE IN ARRAY CATEGORIES

                // mi preparo newCategory 
                const newCategory = {
                    categoryId,
                    categoryName,
                    categoryType,
                    categoryMktgDescritpion,
                    categoryShortDescription
                }
                existingProduct.categories.push(newCategory);
            }
        }
        // rispondo con i dati in formato JSON
        response.status(200)
            .json({
                error: null,
                results: productsWithCategories
            });
    } catch (error) {
        // in caso di errore, rispondo con un messaggio di errore e lo status code 500
        response.status(500)
            .json({
                error: 'Errore del server',
                results: null
            });
    }
};

async function show(request, response) {

    const categoryId = request.realId; // passato gia ddai controlli

    const querySelectProductByCateogryId = `
    SELECT p.*
    FROM products p
    JOIN category_product pc 
    ON p.id = pc.product_id
    JOIN categories c ON pc.category_id = c.id
    WHERE c.id = ? ;`;



    try {
        const [rows] = await pool.query(querySelectProductByCateogryId, [categoryId]);
        // SE NON CI SONO PRODOTTI
        if (rows.length === 0) {
            return response.status(404).json({
                error: 'Nessun prodotto trovato per questa categoria',
                results: []
            });
        }
        // normalizzo i prodotti
        const normalizedProducts = rows.map(normalizeProduct)

        response.json({
            error: null,
            results: normalizedProducts
        })

    } catch (error) {
        response.status(500)
            .json({
                error: 'errore interno del server nel recupero della categoria del prodotto',
                resulTs: null
            });
    }

};

export { index, show };