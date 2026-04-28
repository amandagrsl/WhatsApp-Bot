const express = require('express');
const cors = require('cors');
const client = require('./whatsappService');

const app = express();
app.use(cors());
app.use(express.json()); 

let botStatus = 'Desconectado';

client.on('qr', () => botStatus = 'Aguardando QR Code');
client.on('ready', () => botStatus = 'Conectado');
client.on('disconnected', () => botStatus = 'Desconectado');

app.get('/status', (req, res) => {
  res.json({ status: botStatus });
});

app.get('/atendimentos', (req, res) => {
  console.log("Atendimentos atuais:", client.atendimentosHumanos);
  
  const clientes = client.atendimentosHumanos
    ? Array.from(client.atendimentosHumanos)
    : [];
  res.json({ clientes });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
