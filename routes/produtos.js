const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Usando o get dentro da rota de produtos'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o post dentro da rota de produtos'
    });
});

// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;