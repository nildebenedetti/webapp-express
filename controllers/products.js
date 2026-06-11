// import connection from database
import pool from '../utils/db.js';

async function index(request, response) {
    try {
        const [rows] = await pool.query('select * from `products`');
    

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

//SHOW
async function show(req, res) {
  const realId = Number(req.params.id.trim());

  if (isNaN(realId) || realId <= 0) {
    res.status(400).json({ error: 'Id non valido', results: null });
    return;
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM `products` WHERE id = ?', [realId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: `Prodotto ${realId} non trovato`, results: null });
      return;
    }

    res.status(200).json({ error: null, results: rows[0] });
  } catch (error) {
    console.error("errore durante il recupero del prodotto", error.message);
    res.status(500).json({
      error: 'errore interno del server nel recupero del prodotto',
      results: null
    });
  }
}

export { index, show };