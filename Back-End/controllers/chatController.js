const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');


 exports.listChats = async (req, res) => {
    try {
        const chats = await Chat.getChats();
        res.json(chats);
    } catch (err) {
        console.error("Erro em listChats:", err);  // Mostra o erro completo no terminal
        res.status(500).json({ error: 'Erro ao listar chats' });
    }
};

exports.listMessagesByChat = async (req, res) => {
    try {
        const { id } = req.params;  
        const messages = await Message.getMessagesByChat(id);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar mensagens do chat' });
    }
};


