const express = require('express');
const router = express.Router();
const login = require('../middleware/login'); //Autenticação por rota JWT
const PedidosController = require('../controllers/order-controller')

// Retorna todos os pedidos
router.get('/', PedidosController.getOrders);

// Insere um pedido
router.post('/', login.required, PedidosController.postOrder);

// Retorna os dados de um pedido
router.get('/:orderId', login.required, PedidosController.getOrderDetail);

// Exclui um pedidos
router.delete('/', login.required, PedidosController.deleteOrder);


// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;