const db = require('./db');

async function getChats() {
    const [rows] = await db.query(
        'SELECT id, name, last_message, updated_at FROM chats ORDER BY updated_at DESC'
    );
    return rows;
}

async function upsertChat(id, name, lastMessage) {
    const [result] = await db.query(
        `INSERT INTO chats (id, name, last_message)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), last_message = VALUES(last_message), updated_at = CURRENT_TIMESTAMP`,
        [id, name, lastMessage]
    );
    return result;
}

module.exports = { getChats, upsertChat };

