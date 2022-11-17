const express = require('express');
const router = express.Router();

// Retorna todos os produtos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todos os produtos'
    });
});

// Insere um produto
router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    }
    res.status(201).send({
        mensagem: 'Insere um produto',
        produtoCriado: produto
    });
});

// Retorna os dados de um produto
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

// Altera um produto
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto alterado'
    });
});

// Exclui um produto
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto excluido'
    });
});


// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;