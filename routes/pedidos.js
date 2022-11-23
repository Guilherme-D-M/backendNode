const express = require('express');
const router = express.Router();
const login = require('../middleware/login'); //Autenticação por rota JWT
const PedidosController = require('../controllers/pedidos-controller')

// Retorna todos os pedidos
router.get('/', PedidosController.getPedidos);

// Insere um pedido
router.post('/', login.obrigatorio, PedidosController.postPedidos);

// Retorna os dados de um pedido
router.get('/:id_pedido', login.obrigatorio, PedidosController.getUmPedido);

// Exclui um pedidos
router.delete('/', login.obrigatorio, PedidosController.deletePedido);


// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;