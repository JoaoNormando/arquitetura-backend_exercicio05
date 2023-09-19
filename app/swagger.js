const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0", // Especifique a versão do OpenAPI (3.0.0)
    info: {
      title: "API de Enquetes", // Nome da sua API
      version: "1.0.0", // Versão da sua API
      description: "Documentação da API de Enquetes", // Descrição da sua API
    },
    basePath: "/", // Base path da sua API
  },
  apis: ["./controller/enquetes.js"], // Arquivos onde as definições do Swagger serão extraídas
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
