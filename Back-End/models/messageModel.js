const db = require('./db');

async function getMessagesByChatId(chatId) {
    const [rows] = await db.query(
        'SELECT id, chat_id, from_me, sender, body, type, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
        [chatId]
    );
    return rows;
}

async function createMessage({ chat_id, from_me = 0, sender, body, type = 'text' }) {
    const [result] = await db.query(
        'INSERT INTO messages (chat_id, from_me, sender, body, type) VALUES (?, ?, ?, ?, ?)',
        [chat_id, from_me, sender, body, type]
    );
    const [message] = await db.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
    return message[0];
}

module.exports = { getMessagesByChatId, createMessage };

