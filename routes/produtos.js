const express = require('express');
const router = express.Router();
const mysql = require("./mysql").pool;

// Retorna todos os produtos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM produtos;',
            (error, resultado, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                return res.status(200).send({response: resultado});
            }  
        )
    });

});

// Insere um produto
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, resultado, field) => { //callback
                conn.release();
                if (error) { return res.status(500).send({ error: error })}
                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso',
                    id_produto: resultado.insertId
                });
            }  
        )
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
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            `UPDATE produtos
                SET nome     = ?,
                    preco    = ?
            WHERE id_produto = ?
            `,
            [
                req.body.nome, 
                req.body.preco, 
                req.body.id_produto
            ],
            (error, resultado, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                res.status(201).send({
                    mensagem: 'Produto alterado com sucesso'
                });
            }  
        )
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