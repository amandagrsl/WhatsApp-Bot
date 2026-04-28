const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { upsertChat } = require('./models/chatModel');
const { createMessage } = require('./models/messageModel');

const atendimentosHumanos = new Set();

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-gpu'
    ]
  },
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://githubusercontent.com',
  }
});

client.atendimentosHumanos = atendimentosHumanos;

const iniciadoEm = Date.now();
const usuariosAtendidos = new Set();

const MENU = `Olá! 👋 Escolha uma opção:

1 - Horário
2 - Serviços
3 - Falar com atendente`;

client.on('qr', (qr) => {
  console.log('QR Code gerado, escaneie com seu WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp conectado com sucesso!');
});

client.on('message', async (message) => {
  try {
    if (message.timestamp * 1000 < iniciadoEm) return;
    if (message.from === 'status@broadcast' || message.from.includes('@g.us') || message.fromMe) return;

    const texto = message.body.trim().toLowerCase();
    
    if (atendimentosHumanos.has(`${message._data.notifyName || message.from.split('@')[0]} (${message.from.split('@')[0]})`)) {
        return;
    }

    await upsertChat(message.from, `Chat ${message.from}`, message.body);
    await createMessage({
      chat_id: message.from,
      from_me: 0,
      sender: message._data.notifyName || 'Desconhecido',
      body: message.body,
      type: message.type
    });

    let resposta = '';

    if (!usuariosAtendidos.has(message.from) || /oi|olá|ola|bom dia|boa tarde|boa noite/i.test(texto)) {
      usuariosAtendidos.add(message.from);
      resposta = MENU;
    } else if (texto === '1') {
      resposta = '🕒 Funcionamos das 8h às 18h, de segunda a sexta.';
    } else if (texto === '2') {
      resposta = '💼 Nossos serviços começam a partir de R$ 50,00.';
    } else if (texto === '3') {
      const nomeContato = message._data.notifyName || message.from.split('@')[0];
      const identificador = `${nomeContato} (${message.from.split('@')[0]})`;
      
      atendimentosHumanos.add(identificador);
      console.log(`Adicionado aos atendimentos: ${identificador}`);
      resposta = '👩‍💻 Um momento, estamos te encaminhando para um atendente.';
    } else {
      resposta = '❌ Opção inválida.\n\nDigite:\n1 - Horário\n2 - Serviços\n3 - Falar com atendente';
    }

    await client.sendMessage(message.from, resposta);
    
    await createMessage({
      chat_id: message.from,
      from_me: 1,
      sender: 'AmandaBot',
      body: resposta,
      type: 'text'
    });

  } catch (err) {
    console.error('Erro ao processar mensagem:', err);
  }
});

client.on('disconnected', (reason) => {
  console.log('Cliente desconectado:', reason);
});

client.initialize();
module.exports = client;
