import { z } from "zod";
import { tool } from "langchain";
import { createConnection } from "mysql2";


const querySelectAllReviewsMatchedProducts = `
select r.title, r.body, r.start_rating as star_rating , r.submission_date, r.find_it_useful, r.product_id, p.name, p.short_description
from reviews r
join products p on p.id = r.product_id;
`;

async function fetchReviews() {
    const dbConnection = await createConnection({
        host: process.env.DB_HOSTNAME,
        user: process.env.DB_USERNAME,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    const [rows] = await dbConnection.execute(querySelectAllReviewsMatchedProducts) // inserire la query
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
        query: z.string().description("Il nome del prodotto o la chiave di ricerca da cercare nel database.")
    }),

}

const customerVoiceTool = tool(fetchReviews, toolDefinition);

export { customerVoiceTool };