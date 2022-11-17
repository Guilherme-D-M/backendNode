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

router.get('/:id_produto', (req, res, next) => {
    //Pega o parametro do id que foi passado na url
    const id = req.params.id_produto;

    if (id =='especial'){
        res.status(200).send({
            mensagem: 'Parabens ID especial',
            id: id
        });
    }else{
        res.status(200).send({
            mensagem: 'Passou um ID',
            id: id
        });
    }
});


// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;