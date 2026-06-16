import { z } from "zod";
import { tool } from "langchain";
import { querySelectAll } from "../../utils/queries";

function fetchProductInformation() {
    const [rows] = await dbConnection.execute(querySelectAll) // inserire la query
    const rowsJSON = JSON.stringify(rows);
    return rowsJSON;
}

const toolDefinition = {
    name: "product_scraper",
    description: `restituisce tutte le informazioni inerenti ai prodotti della gelateria iScream.
    è utile consultare questo tool per verificare informazioni relative al prodotto come nome, descrizione, prezzo, ingredienti e allergeni.
    `

}

const customerVoiceTool = tool(fetchReviews, toolDefinition);

export { productScraperTool };