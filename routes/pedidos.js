const express = require('express');
const router = express.Router();
const mysql = require("./mysql").pool;

// Retorna todos os pedidos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM pedidos;',
            (error, result, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedido => {
                        return{
                            id_pedido: pedido.id_pedido,
                            id_produto: pedido.id_produto,
                            quantidade: pedido.quantidade,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido especifico',
                                url: 'http://localhost:3000/pedidos/'+pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send({response});
            }  
        )
    });
});

// Insere um pedido
router.post('/', (req, res, next) => {
    //VERIFICA SE TEM PRODUTO
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query('SELECT * FROM produtos WHERE id_produto = ?', [req.body.id_produto], 
        (error, result, field) => {
            if (error) { return res.status(500).send({ error: error })}

            //SE NÃO TIVER RETORNA 404
            if (result.length ==0){
                return res.status(404).send({
                    mensagem: 'Produto nao encontrado'
                })
            }
            
            //SE TIVER VAI DAR CONTINUIDADE NO PEDIDO
            conn.query(
                'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
                [req.body.id_produto, req.body.quantidade],
                (error, result, field) => { //callback
                    conn.release();
                    if (error) { return res.status(500).send({ error: error })}
                    const response = {
                        mensagem: 'Pedido inserido com sucesso',
                        pedidoCriado:{
                            id_pedido: result.id_pedido,
                            id_produto: req.body.id_produto,
                            quantidade: req.body.quantidade,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://localhost:3000/pedidos' //lista de todos os pedidos
                            }               
                        }
                    }
                    return res.status(201).send(response);
                }  
            )
        })
    })
});

// Retorna os dados de um pedido
router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;', 
            [req.params.id_pedido],
            (error, result, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                if (result.length ==0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com este ID'
                    })
                }

                const response = {
                    pedido:{
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/produtos' //lista de todos os pedidos
                        }           
                    }
                }
                return res.status(201).send(response);
            }  
        )
    }); 
});

// Exclui um pedidos
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'DELETE FROM pedidos WHERE id_pedido = ?', [req.body.id_pedido],
            (error, resultado, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                
                const response={
                    mensagem: 'Pedido removido com sucesso',
                    request:{
                        tipo:'POST',
                        descricao:'Insere um Pedido',
                        url: 'http://localhost:3000/pedidos',
                        body:{
                            id_produto:'Number',
                            quantidade:'Number'
                        }
                    }
                }
                res.status(202).send(response);
            }  
        )
    });
});


// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;