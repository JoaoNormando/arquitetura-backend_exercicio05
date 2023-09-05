const express = require("express");
const router = express.Router();

const enquetes = [{
    id: 1,
    name: 'Enquete 01',
    total: 0
}]

router.get('/', (req, res) => {
    return res.status(200).send(enquetes);
});

router.post('/', (req, res) => {
    const { name } = req.body
    const lastId = Math.max(...enquetes.map(e => e.id));
    const novaEnquete = { id: lastId + 1, name, total: 0 }
    enquetes.push(novaEnquete)
    return res.status(201).json(novaEnquete)
})

router.patch('/:id', (req, res) => {
    const { id } = req.params

    const enquete = enquetes.find(e => e.id == id)
    enquete.total = ++enquete.total;

    return res.status(200).json(enquete);
})


router.delete('/:id', (req, res) => {
    const { id } = req.params

    const enquete = enquetes.find(e => e.id == id)
    if (enquete.total > 0)
        enquete.total = --enquete.total;

    return res.status(200).json(enquete);
})


module.exports = router;