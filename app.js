//Importa o express
const express = require('express');
//Variavel que cria uma instancia do express
const app = express();

//cria a rota
const rotaProdutos = require('./routes/produtos');

//chama a rota
app.use('/produtos', rotaProdutos);

//Exporta os módulos
module.exports = app;