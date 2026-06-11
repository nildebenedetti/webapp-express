import pool from "../utils/db.js";

async function index(request, response) {
    try {
        // Recupera dall'URL il parametro star_rating.
        const { start_rating } = request.query;

        // Query di partenza se non viene specificato alcun filtro.
        let sql = "SELECT * FROM reviews";
        // Conterrà i valori da inserire al posto di ? nella query.
        const values = [];

        // Se nell'URL è presente il parametro star_rating converte il valore ricevuto da stringa a numero per poter verificare che sia un voto valido.
        if (start_rating !== undefined) {
            const rating = Number(start_rating);

            // Il valore deve essere un numero intero compreso tra 1 e 5.
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return response.status(400).json({
                    error: "star_rating deve essere un numero intero compreso tra 1 e 5",
                    results: null
                });
            }

            // Aggiunge alla query il filtro per il numero di stelle.
            sql += " WHERE start_rating = ?";
            // Il valore di rating viene inserito nell'array values.
            values.push(rating);
        }

        console.log("Parametro ricevuto:", start_rating);
        console.log("Query eseguita:", sql, values);

        // Esegue la query.
        // senza filtro values restituisce tutte le recensioni.
        // con il filtro star_rating restituisce solo quelle con il voto richiesto.
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
    // Recupera l'id dall'URL e lo converte da stringa a numero.
    const realId = Number(request.params.id.trim());

    // Verifica che l'id sia un numero intero positivo, se l'id non è valido, interrompe la funzione e restituisce errore 400.
    if (!Number.isInteger(realId) || realId <= 0) {
        response.status(400).json({ error: 'Id non valido', results: null });
        return;
    }

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
        title,
        body,
        start_rating,
        author_name,
        find_it_useful,
        product_id
    } = request.body;

    // Verifica che i campi obbligatori siano presenti.
    if (
        !title ||
        !body ||
        start_rating === undefined ||
        !author_name
    ) {
        return response.status(400).json({
            error: "Dati mancanti: title, body, start_rating e author_name sono obbligatori",
            results: null
        });
    }
    // Converte il numero di stelle in un valore numerico.
    const rating = Number(start_rating);

    // Verifica che il voto sia un numero intero compreso tra 1 e 5.
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return response.status(400).json({
            error: "start_rating deve essere un numero intero compreso tra 1 e 5",
            results: null
        });
    }

    // Se product_id è presente, verifica che sia un numero intero positivo.
    const realProductId =
        product_id === undefined || product_id === null
            ? null
            : Number(product_id);

    if (
        realProductId !== null &&
        (!Number.isInteger(realProductId) || realProductId <= 0)
    ) {
        return response.status(400).json({
            error: "product_id deve essere un numero intero positivo",
            results: null
        });
    }

    const submissionDate = generateCurrentDate();

    const sqlCreate = `INSERT INTO reviews
            (title, body, start_rating, author_name, submission_date, find_it_useful, product_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

    try {
        // Inserisce la nuova recensione nel database i valori vengono associati ai segnaposto ? nello stesso ordine.
        const [result] = await pool.execute(
            sqlCreate,
            [
                title.trim(),
                body.trim(),
                rating,
                author_name.trim(),
                submissionDate,
                find_it_useful ?? 0,
                realProductId
            ]
        );

        // Restituisce i dati principali della recensione appena creata.
        response.status(201).json({
            error: null,
            results: {
                id: result.insertId,
                title: title.trim(),
                body: body.trim(),
                start_rating: rating,
                submission_date: submissionDate,
                author_name: author_name.trim(),
                find_it_useful: find_it_useful ?? 0,
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