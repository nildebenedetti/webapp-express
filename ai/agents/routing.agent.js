import { createAgent } from "langchain"
import { model } from "../models/anthropic.js"
import { z } from 'zod';

const responseFormat = z.object({
    choice: z.enum(['GENERIC', 'CUSTOMER_VOICE']).describe('la scelta che hai valutato')
});


const routingAgent = createAgent({
    systemPrompt: `
    Sei il Routing Agent della gelateria iScream. Il tuo unico compito è analizzare il messaggio dell'utente e scegliere l'agente più adatto impostando 'choice'.

    LINEE GUIDA PER LA SCELTA:

    - Scegli 'GENERIC' se l'utente chiede informazioni oggettive, tecniche o di catalogo sui prodotti.
      Esempi: "Che gusti avete?", "Quali sono gli ingredienti del cioccolato?", "Avete gelati senza glutine?", "Quanto costa il cono?"

    - Scegli 'CUSTOMER_VOICE' se l'utente esprime dubbi, chiede un parere soggettivo, vuole consigli basati sull'esperienza o fa riferimento alle opinioni altrui.
      Esempi: "Qual è il gelato più buono?", "Cosa mi consigli?", "Com'è il gusto fragola?", "Le recensioni dicono che il locale è pulito?", "Cosa ne pensa la gente del vostro pistacchio?"

    Analizza il tono e l'intento profondo della richiesta: se c'è una richiesta di parere o rassicurazione, dai la priorità a CUSTOMER_VOICE.
    `,
    model,
    responseSchema: responseFormat
});

export default routingAgent;