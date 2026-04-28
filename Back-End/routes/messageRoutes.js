const express = require('express');
const router = express.Router({ mergeParams: true });
const { getMessagesByChatId } = require('../models/messageModel');

router.get('/', async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const messages = await getMessagesByChatId(chatId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
