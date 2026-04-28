const express = require('express');
const router = express.Router();
const { getChats } = require('../models/chatModel');

router.get('/', async (req, res) => {
  console.log("Rota GET /api/chats chamada");
  try {
    const chats = await getChats();
    res.json(chats);
  } catch (err) {
    console.error("Erro em getChats:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
