const express = require('express');
const router = express.Router();
const mysql = require("./mysql").pool;

//Upload de imagens
const multer = require('multer');

const login = require('../middleware/login');

//Salva na pasta upload com o nome da imagem
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        //Necessario substituir o : por -. NO windows tem problema.
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
});

//Filtro que aceita imagens jpeg e png
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png'){
        cb(null, true); //retorna true
    }else{
        cb(null, false); //retorna false
    }
}

//Recebe o objeto criado acima
const upload = multer({ 
    storage: storage,
    // limite max de tamanho e limite de 5mb 
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    //aplica o filtro
    fileFilter: fileFilter
})

// Retorna todos os produtos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return{
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: 'http://localhost:3000/produtos/'+prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send({response});
            }  
        )
    });
});

// Insere um produto
router.post('/', upload.single('produto_imagem'), login, (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [
                req.body.nome, 
                req.body.preco,
                req.file.path
            ],
            (error, result, field) => { //callback
                conn.release();
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado:{
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos' //lista de todos os produtos
                        }               
                    }
                }
                return res.status(201).send(response);
            }  
        )
    });
});

// Retorna os dados de um produto
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;', 
            [req.params.id_produto],
            (error, result, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                
                if (result.length ==0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    })
                }

                const response = {
                    produto:{
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos' //lista de todos os produtos
                        }           
                    }
                }
                return res.status(201).send(response);
            }  
        )
    });
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
            (error, result, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado:{
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto especifico',
                            url: 'http://localhost:3000/produtos/'+req.body.id_produto
                        }             
                    }
                }
                return res.status(202).send(response);
            }  
              
        )
    });
});

// Exclui um produto
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error })}
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?', [req.body.id_produto],
            (error, resultado, field) => { //callback
                if (error) { return res.status(500).send({ error: error })}
                const response={
                    mensagem: 'Produto removido com sucesso',
                    request:{
                        tipo:'POST',
                        descricao:'Insere um produto',
                        url: 'http://localhost:3000/produtos',
                        body:{
                            nome:'String',
                            preco:'Number'
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