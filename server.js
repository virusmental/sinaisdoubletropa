const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

// Webhook do Telegram
const telegramToken = "7951065344:AAHLJaeOGAYjNyiQ-mFWRp-k8SRwe6zKNWo";  // Token do seu bot
const chatId = "-1002690379625";  // ID do seu canal

// Configura o Webhook do Telegram
app.post(`/webhook`, (req, res) => {
    const message = req.body.message.text;
    const user = req.body.message.from.username;

    // Envia a mensagem recebida para os clientes conectados via WebSocket
    io.emit('new_message', { user, message });

    res.send('OK'); // Responde ao Telegram confirmando o recebimento
});

// Configuração do WebSocket para os clientes
io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Inicia o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
