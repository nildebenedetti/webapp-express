import { z } from "zod";
import { tool } from "langchain";
import pool from "../../utils/db.js";


const querySelectAllReviewsMatchedProducts = `
select r.title, r.body, r.start_rating as star_rating , r.submission_date, r.find_it_useful, r.product_id, p.name, p.short_description
from reviews r
join products p on p.id = r.product_id;
`;

async function fetchReviews() {

    const [rows] = await pool.execute(querySelectAllReviewsMatchedProducts) // inserire la query
    const rowsJSON = JSON.stringify(rows);
    return rowsJSON;
}

const toolDefinition = {
    name: "customer_voice",
    description: `restituisce tutte le reviews dei clienti abbinate ai prodotti del negozio di gelati iScream. 
    è utile consultare questo tool per verificare informazioni relative alla customer voice, come ad esempio: 
    - quali sono i prodotti con un rating medio più alto
    - le motivazioni per cui un prodotto è piaciuto oppure no ai clienti
    - i points of strength dei prodotti in base alle opinioni dei clienti
    `,
    schema: z.object({
        query: z.string().describe("Il testo libero della richiesta dell'utente, le parole chiave o l'argomento principale della chat da cercare nel database.")
    }),

}

const customerVoiceTool = tool(fetchReviews, toolDefinition);

export { customerVoiceTool };