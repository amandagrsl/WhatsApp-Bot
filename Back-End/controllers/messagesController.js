const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

exports.createMessage = async (req, res) => {
    try {
        const { chat_id, sender, body, from_me, type } = req.body;

        if (!chat_id || !body) {
            return res.status(400).json({ error: 'chat_id e body são obrigatórios' });
        }

        await Chat.upsertChat(chat_id, sender || null, body);

        const result = await Message.createMessage({
            chat_id,
            from_me: from_me ? 1 : 0,
            sender,
            body,
            type: type || 'text',
        });

        res.status(201).json({ id: result.id, message: 'Mensagem criada com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar mensagem' });
    }
    };