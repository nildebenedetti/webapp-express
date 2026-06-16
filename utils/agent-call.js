import { HumanMessage } from "langchain";
import routingAgent from "../ai/agents/routing.agent.js";
import genericAgent from "../ai/agents/generic.agent.js";
import customerVoiceAgent from "../ai/agents/customer-voice.agent.js";

let agentChoose;

const prompt = 'vorrei un gelato con la ciliegia'
// const prompt = 'qual'è il gelato preferito dei clienti?'



const aiResponse = await routingAgent.invoke({
    messages: [
        new HumanMessage(prompt)
    ]
});

const { choice } = aiResponse.structuredResponse;

agentChoose = choice === 'CUSTOMER_VOICE' ? customerVoiceAgent : genericAgent;


const aiResponseFinal = await agentChoose.invoke({
    messages: [
        new HumanMessage(prompt)
    ]
});

if (aiResponseFinal.structuredResponse !== undefined) {
    console.log(aiResponseFinal.structuredResponse);
} else {
    console.log(aiResponseFinal.messages.at(-1).content)
}
// si aggiunge structured response per parsare JSON



