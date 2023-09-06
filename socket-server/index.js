const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/mensagem', (req, res) => {
  const { mensagem, enquete } = req.body
  io.emit(mensagem,  enquete)
  return res.json({ message: 'Mensagem recebida com sucesso' })
})

io.on('connection', (socket) => {
});


server.listen(4000, () => console.log('Socket-server is running'))