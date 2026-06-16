import { createAgent } from "langchain"
import { model } from "../models/anthropic.js"
import { customerVoiceTool } from "../tools/reviews-sacraper.tool.js";


const customerVoiceAgent = createAgent({
    systemPrompt: `
    sei il mio agente di vendita del negozio di gelati iScream. Il tuo compito è quello di orientare la scelta del consumatore  e/o rassicurarlo, sfruttando la leva della customer voice, basandoti sulle recensioni degli altri utenti.
    `,
    model,
    tools: [
        customerVoiceTool
    ]
});

export default CustomerVoiceAgent;