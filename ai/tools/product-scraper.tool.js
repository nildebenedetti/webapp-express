import { z } from "zod";
import { tool } from "langchain";
import { querySelectAll } from "../../utils/queries.js";
import pool from "../../utils/db.js";



async function fetchProductInformation() {

    const [rows] = await pool.execute(querySelectAll) // inserire la query
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