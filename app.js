//Importa o express
const express = require('express');
//Variavel que cria uma instancia do express
const app = express();
const morgan = require('morgan');

//cria a rota
const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

//Biblioteca morgan para mostrar o log da API no console
app.use(morgan('dev'));

//chama a rota
app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);


//Tratamento caso não encontre rota
app.use((req, res, next)=>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro : {
            mensagem: error.message
        }
    })
})

//Exporta os módulos
module.exports = app;