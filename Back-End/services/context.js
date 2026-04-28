
const chatContext = {}; 

function setLastMessage(chatId, message) {
    chatContext[chatId] = message;
}

function getLastMessage(chatId) {
    return chatContext[chatId] || "";
}

module.exports = { setLastMessage, getLastMessage };
