import pool from "../utils/db.js";

async function index(request, response) {
    try {
        // Query di partenza se non viene specificato alcun filtro.
        let sql = "SELECT * FROM reviews";
        // Conterrà i valori da inserire al posto di ? nella query.
        const values = [];

        // Se il middleware ha validato start_rating, aggiunge il filtro alla query.
        if (request.rating !== undefined) {
            sql += " WHERE start_rating = ?";
            values.push(request.rating);
        }

        console.log("Parametro ricevuto:", request.rating);
        console.log("Query eseguita:", sql, values);

        // Esegue la query.
        // Senza filtro la query restituisce tutte le recensioni.
        // Con il filtro start_rating restituisce solo quelle con il voto richiesto.
        const [rows] = await pool.execute(sql, values);

        // Anche se non sono presenti recensioni non viene restituito un errore perché un risultato vuoto è possibile.
        if (rows.length === 0) {
            return response.json({
                error: null,
                message: "Nessuna recensione trovata",
                results: []
            });
        }

        // Restituisce le recensioni trovate.
        response.json({
            error: null,
            results: rows
        });
    } catch (error) {
        console.error(error);

        // Gestisce eventuali problemi del server o del database.
        response.status(500).json({
            error: "Errore interno del server",
            results: null
        });
    }
}

async function show(request, response) {
    const { realId } = request;

    const sqlShow = 'SELECT * FROM `reviews` WHERE id = ?'

    try {
        // Cerca nel database la recensione con l'id richiesto, il valore realId viene associato al segnaposto ?.
        const [rows] = await pool.execute(
            sqlShow, [realId]
        );
        // Se non viene trovata alcuna recensione con l'id specificato, restituisce un errore 404.
        if (rows.length === 0) {
            response.status(404).json({
                error: `Recensione ${realId} non trovata`,
                results: null
            });
            return;
        }
        // Restituisce la singola recensione trovata.
        response.status(200).json({
            error: null,
            results: rows[0]
        });
    } catch (error) {
        console.error(
            "errore durante il recupero della recensione",
            error.message
        );
        // Gestisce eventuali problemi del server o del database.
        response.status(500).json({
            error: 'errore interno del server nel recupero della recensione',
            results: null
        });
    }
}

const generateCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
}

async function create(request, response) {
    const {
        realTitle,
        realBody,
        rating,
        realAuthorName,
        realProductId
    } = request;

    const submissionDate = generateCurrentDate();

    const sqlCreate = `INSERT INTO reviews
            (title, body, start_rating, author_name, submission_date, find_it_useful, product_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

    try {
        // Inserisce la nuova recensione nel database i valori vengono associati ai segnaposto ? nello stesso ordine.
        const [result] = await pool.execute(
            sqlCreate,
            [
                realTitle,
                realBody,
                rating,
                realAuthorName,
                submissionDate,
                0,
                realProductId
            ]
        );

        // Restituisce i dati principali della recensione appena creata.
        response.status(201).json({
            error: null,
            results: {
                id: result.insertId,
                title: realTitle,
                body: realBody,
                start_rating: rating,
                author_name: realAuthorName,
                submission_date: submissionDate,
                find_it_useful: 0,
                product_id: realProductId
            }
        });
    } catch (error) {
        console.error(
            "Errore durante la creazione della recensione",
            error.message
        );

        response.status(500).json({
            error: "Errore interno del server durante la creazione della recensione",
            results: null
        });
    }
}


export { index, show, create };