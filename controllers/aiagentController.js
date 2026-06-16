import { model } from "../ai/models/anthropic.js"
import { HumanMessage } from "langchain";
import routingAgent from "../ai/agents/routing.agent.js";
import genericAgent from "../ai/agents/generic.agent.js";
import customerVoiceAgent from "../ai/agents/customer-voice.agent.js";


async function chat(request, response) {
    const { prompt } = request.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        response.status(400)
            .json({
                error: "il campo prompt è obbligatorio e deve essere una stringa non vuota",
                results: null
            })
    }

    const aiResponse = await routingAgent.invoke({
        messages:[
        new HumanMessage(prompt)
    ]
});

    let agentChoose;

    const choice = aiResponse.messages.at(-1).content;
    
    agentChoose = choice === 'CUSTOMER_VOICE' ? customerVoiceAgent : genericAgent;


    const aiResponseFinal = await agentChoose.invoke({
        messages: [
            new HumanMessage(prompt)
        ]
    });

    response.status(203)
        .json({
            error: null,
            results: aiResponseFinal.messages.at(-1).content
        });

}

export { chat };