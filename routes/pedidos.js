const express = require('express');
const router = express.Router();
const mysql = require("./mysql").pool;

const PedidosController = require('../controllers/pedidos-controller')

// Retorna todos os pedidos
router.get('/', PedidosController.getPedidos);

// Insere um pedido
router.post('/', PedidosController.postPedidos);

// Retorna os dados de um pedido
router.get('/:id_pedido', PedidosController.getUmPedido);

// Exclui um pedidos
router.delete('/', PedidosController.deletePedido);


// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;