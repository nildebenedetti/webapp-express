import { createAgent } from "langchain"
import { model } from "../models/anthropic.js"
import { z } from 'zod';

const responseFormat = z.object({
    choice: z.enum(['GENERIC', 'CUSTOMER_VOICE']).describe('la scelta che hai valutato')
});


const routingAgent = createAgent({
    systemPrompt: `
    sei il mio routing agent, leggi il messaggio in ingresso e valuta:
    - se è una richiesta generica relativa ai prodotti
    - se è una richiesta relativa all'opinion
    se è generica o relativa ai prodotti, scegli GENERIC, se è relativa all'opinione dei consumatori scegli CUSTOMER_VOICE
    `,
    model
});

export default routingAgent;