const express = require('express');
const router = express.Router();
const mysql = require("./mysql").pool;
const bcrypt = require('bcrypt'); //Biblioteca para encriptar senha

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


module.exports = router;