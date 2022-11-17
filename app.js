//Importa o express
const express = require('express');
//Variavel que cria uma instancia do express
const app = express();

//cria a rota
const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

//chama a rota
app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

//Exporta os módulos
module.exports = app;