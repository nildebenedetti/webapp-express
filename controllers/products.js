// import connection from database

async function index(request, response) {
    try {
        const [rows] = await connection.query('select * from `products`');
    

    response.json({
        error: null,
        results: rows
    });
    } catch (error) {
        console.error("errore durante l'import del catalogo prodotti", error.message)
        response.status(500).json({
            error:'errore interno del server nel recupero del catalogo prodotti',
            results: null
        })
    }


}

export { index };