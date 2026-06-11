import connection from '../utils/db.js';

// funzione che gestisce la richiesta GET per ottenere tutte le categorie
const index = async (request, response) => {
    try {
    // eseguo la query per ottenere tutte le categorie dal database
        const [categories] = await connection.query('SELECT * FROM categories');

        // rispondo con i dati in formato JSON
        response.json(categories);
    } catch (error) {
        // in caso di errore, rispondo con un messaggio di errore e lo status code 500
        response.status(500).json({ error: 'Errore del server' });
    }
};

export { index};