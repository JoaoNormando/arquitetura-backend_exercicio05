const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const fetch = require("node-fetch");

/**
 * @swagger
 * components:
 *   schemas:
 *     Enquete:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               votes:
 *                 type: integer
 *     EnqueteInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 */

const enquetes = [
  {
    id: 1,
    name: "Enquete CLOUD Provider",
    items: [
      { id: "fed956fd-fc7d-44a1-8909-90024499dbad", name: "AWS", votes: 0 },
      { id: "be49d729-6c4e-4ca5-add0-51eb3fde8cb6", name: "GCP", votes: 0 },
    ],
  },
];

/**
 * @swagger
 * /enquetes:
 *   get:
 *     summary: Retorna todas as enquetes.
 *     responses:
 *       200:
 *         description: Lista de enquetes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enquete'
 */

router.get("/", (req, res) => {
  console.log("Recuperando todas as enquetes...");
  return res.status(200).send(enquetes);
});

/**
 * @swagger
 * /enquetes:
 *   post:
 *     summary: Cria uma nova enquete.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnqueteInput'
 *     responses:
 *       201:
 *         description: Enquete criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enquete'
 */

router.post("/", (req, res) => {
  const { name, items } = req.body;
  const lastId = Math.max(...enquetes.map((e) => e.id));
  const novaEnquete = {
    id: lastId + 1,
    name,
    items: items.map((i) => ({ id: randomUUID(), ...i })),
  };
  enquetes.push(novaEnquete);
  sendNotification("nova-enquete", novaEnquete);
  return res.status(201).json(novaEnquete);
});

/**
 * @swagger
 * /enquetes/{id}/items/{id_item}:
 *   patch:
 *     summary: Registra um voto em um item de enquete.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da enquete.
 *       - in: path
 *         name: id_item
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item de enquete.
 *     responses:
 *       200:
 *         description: Votação computada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.patch("/:id/items/:id_item", (req, res) => {
  const { id, id_item } = req.params;

  const enquete = enquetes.find((e) => e.id == id);
  const enqueteItem = enquete.items.find((i) => i.id == id_item);

  enqueteItem.votes = ++enqueteItem.votes;

  sendNotification("novo-voto", enquete);

  return res.status(200).json({ message: "Votação computada com sucesso" });
});

/**
 * @swagger
 * /enquetes/{id}/items/{id_item}:
 *   delete:
 *     summary: Remove um voto de um item de enquete.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da enquete.
 *       - in: path
 *         name: id_item
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item de enquete.
 *     responses:
 *       200:
 *         description: Votação retirada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id/items/:id_item", (req, res) => {
  const { id, id_item } = req.params;

  const enqueteItem = enquetes
    .find((e) => e.id == id)
    .items.find((i) => i.id == id_item);
  if (enqueteItem.votes > 0) enqueteItem.votes = --enqueteItem.votes;

  return res.status(200).json({ message: "Votação retirada com sucesso" });
});

function sendNotification(mensagem, enquete) {
  fetch("http://localhost:4000/mensagem", {
    method: "POST",
    body: JSON.stringify({
      mensagem,
      enquete,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
}

module.exports = router;
