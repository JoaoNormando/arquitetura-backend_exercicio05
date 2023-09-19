const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const swaggerSetup = require("./swagger");

app.use(express.json());

/**
 * @swagger
 * /mensagem:
 *   post:
 *     summary: Envie uma mensagem para a aplicação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mensagem:
 *                 type: string
 *                 description: Mensagem a ser enviada.
 *               enquete:
 *                 $ref: '#/components/schemas/Enquete'
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/mensagem", (req, res) => {
  const { mensagem, enquete } = req.body;
  io.emit(mensagem, enquete);
  return res.json({ message: "Mensagem recebida com sucesso" });
});

io.on("connection", (socket) => {});

server.listen(4000, () => console.log("Socket-server is running"));
swaggerSetup(app);
