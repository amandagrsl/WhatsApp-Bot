const lastMessages = {};

/*
 * @param {string} message 
 * @param {string} chatId 
 * @returns {string} 
 */

async function generateAIResponse(message, chatId) {
    const context = lastMessages[chatId] || "";

    const respostasSimuladas = [
        { trigger: /oi/i, resposta: "Olá! Eu sou AmandaBot, sua assistente virtual. Como posso te ajudar hoje?" },
        { trigger: /tudo bem\??/i, resposta: "Tudo ótimo! E você?" },
        { trigger: /qual é o seu nome\??/i, resposta: "Eu sou AmandaBot, seu assistente virtual." },
        { trigger: /obrigad[oa]/i, resposta: "De nada! 😄" },
        { trigger: /tchau|até logo|até mais/i, resposta: "Até logo! Foi um prazer conversar com você!" }
    ];

    for (const item of respostasSimuladas) {
        if (item.trigger.test(message.trim())) {
            lastMessages[chatId] = message; 
            return item.resposta;
        }
    }

    lastMessages[chatId] = message;
    return "Desculpe, ainda estou aprendendo a responder isso.";
}

module.exports = { generateAIResponse };



