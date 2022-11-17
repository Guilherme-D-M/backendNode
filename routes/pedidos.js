const express = require('express');
const router = express.Router();

// Retorna todos os pedidos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os pedidos'
    });
});

// Insere um pedidos
router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }
    res.status(201).send({
        mensagem: 'Pedido criado',
        pedidoCriado: pedido
    });
});

// Retorna os dados de um pedidos
router.get('/:id_pedido', (req, res, next) => {
    //Pega o parametro do id que foi passado na url
    const id = req.params.id_pedido;
        res.status(200).send({
            mensagem: 'Detalhes do pedido',
            id: id
        }); 
});

// Exclui um pedidos
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido excluido'
    });
});


// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;