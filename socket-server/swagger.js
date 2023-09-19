const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const app = express();

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API de Enquetes e Mensagens",
      version: "1.0.0",
      description: "Documentação da API de Enquetes e Mensagens",
    },
    basePath: "/",
  },
  apis: ["./controller/enquetes.js"], // Adicione outros arquivos de rota conforme necessário
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
