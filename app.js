//Importa o express
const express = require('express');
//Variavel que cria uma instancia do express
const app = express();

//Requisição, resposta e next para ir para o próximo método
app.use((req, res, next) => {
    res.status(200).send({
        mensagem: 'Ok, deu certo'
    });
});

module.exports.app;