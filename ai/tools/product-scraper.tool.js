import { z } from "zod";
import { tool } from "langchain";
import { querySelectAll } from "../../utils/queries.js";
import { createConnection } from "mysql2";



async function fetchProductInformation() {
    const dbConnection = await createConnection({
        host: process.env.DB_HOSTNAME,
        user: process.env.DB_USERNAME,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    const [rows] = await dbConnection.execute(querySelectAll) // inserire la query
    const rowsJSON = JSON.stringify(rows);
    return rowsJSON;
};

const toolDefinition = {
    name: "product_scraper",
    description: `restituisce tutte le informazioni inerenti ai prodotti della gelateria iScream.
    è utile consultare questo tool per verificare informazioni relative al prodotto come nome, descrizione, prezzo, ingredienti e allergeni.
    `,
    schema: z.object({
        query: z.string().describe("Il testo libero della richiesta dell'utente, le parole chiave o l'argomento principale della chat da cercare nel database.")
    }),

};

const productInfoTool = tool(fetchProductInformation, toolDefinition);

export { productInfoTool };