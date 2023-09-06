const express = require("express");
const router = express.Router();
const { randomUUID } = require('crypto')
const fetch = require('node-fetch')

const enquetes = [{
    id: 1,
    name: 'Enquete CLOUD Provider',
    items: [
        { id: 'fed956fd-fc7d-44a1-8909-90024499dbad', name: 'AWS', votes: 0 },
        { id: 'be49d729-6c4e-4ca5-add0-51eb3fde8cb6', name: 'GCP', votes: 0 },
    ]

}]

router.get('/', (req, res) => {
    console.log('Recuperando todas as enquetes...')
    return res.status(200).send(enquetes);
});

router.post('/', (req, res) => {
    const { name, items } = req.body
    const lastId = Math.max(...enquetes.map(e => e.id));
    const novaEnquete = { id: lastId + 1, name, items: items.map(i => ({ id: randomUUID(), ...i })) }
    enquetes.push(novaEnquete)
    sendNotification('nova-enquete', novaEnquete)
    return res.status(201).json(novaEnquete)
})

router.patch('/:id/items/:id_item', (req, res) => {
    const { id, id_item } = req.params

    const enquete = enquetes.find(e => e.id == id)
    const enqueteItem = enquete.items
        .find(i => i.id == id_item)

    enqueteItem.votes = ++enqueteItem.votes;

    sendNotification('novo-voto', enquete)

    return res.status(200).json({ message: 'Votação computada com sucesso' });
})


router.delete('/:id/items/:id_item', (req, res) => {
    const { id, id_item } = req.params

    const enqueteItem = enquetes
        .find(e => e.id == id).items
        .find(i => i.id == id_item)
    if (enqueteItem.votes > 0)
        enqueteItem.votes = --enqueteItem.votes;

    return res.status(200).json({ message: 'Votação retirada com sucesso' });
})

function sendNotification(mensagem, enquete) {
    fetch('http://localhost:4000/mensagem', {
        method: 'POST',
        body: JSON.stringify({
            mensagem,
            enquete
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log(error)
        })
}


module.exports = router;