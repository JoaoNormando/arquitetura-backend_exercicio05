const serverless = require("serverless-http");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const swaggerSetup = require("./swagger");

const enquetesController = require("./controller/enquetes.js");

app.use(express.json());

app.get("/", (req, res, next) => {
  io.emit("some event", {
    someProperty: "some value",
    otherProperty: "other value",
  });
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use("/enquetes", enquetesController);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

swaggerSetup(app);

io.on("connection", (socket) => {
  console.log("User connected to system");
});

module.exports.handler = serverless(app);
