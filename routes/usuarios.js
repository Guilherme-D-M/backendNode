const express = require('express');
const router = express.Router();
const mysql = require("./mysql").pool;
const bcrypt = require('bcrypt'); //Biblioteca para encriptar senha
const { restart } = require('nodemon');

router.post('/cadastro', (req, res, next)=>{
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: err })}

        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) =>{
            if (results.length > 0){ //Verificar se ja possui email cadastrado
                res.status(409).send({mensagem: "Usuario já cadastrado"})
            }else{ //caso não tiver, encripta a senha e manda pro banco de dados.
                bcrypt.hash(req.body.senha, 10, (errBcrypt,hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt })}
        
                    conn.query(
                        `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
                    [req.body.email,hash],
                    (err, results) =>{
                        conn.release();
                        if (err) { return res.status(500).send({ error: err })}
                        response = {
                            mensagem: "Usuario criado com sucesso",
                            usuarioCriado: {
                                id_usuario: results.insertId,
                                email: req.body.email
                            }
                        }
                        return res.status(201).send(response)
                    })
                }); 
            }
        })
    });
});

router.post('/login', (req, res, next)=> {
    mysql.getConnection((error, conn) => {
       if(error){ return res.status(500).send({ error: error}) }
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        conn.query(query,[req.body.email],(error, results, fields)=>{
           conn.release();
           if(error){ return res.status(500).send({ error: error}) }
           if(results.length < 1){
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
           }

           bcrypt.compare(req.body.senha, results[0].senha, (err, result)=>{
                if (err){
                    return res.status(401).send({ mensagem: 'Falha na autenticação' })
                }
                if (result){
                    return res.status(200).send({ mensagem: 'Autenticado com sucesso' })
                }

                return res.status(401).send({ mensagem: 'Falha na autenticação' })
           });
        });
    });
})

module.exports = router;