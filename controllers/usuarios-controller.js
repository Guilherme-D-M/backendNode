const mysql = require("../routes/mysql");
const bcrypt = require('bcrypt'); //Biblioteca para encriptar senha
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = async(req, res, next)=>{

    try{
        var query = 'SELECT * FROM users WHERE email = ?';
        const result = await mysql.execute(query, [req.body.email])

        if (result.length > 0){ //Verificar se ja possui email cadastrado
            res.status(409).send({mensagem: "Usuario já cadastrado"})
        } //caso não tiver, encripta a senha e manda pro banco de dados.

        const hash = await bcrypt.hashSync(req.body.senha, 10);

            query = 'INSERT INTO users (email, password) VALUES (?,?);';
            const results = await mysql.execute(query, [req.body.email,hash]);

            const response = {
                mensagem: "Usuario criado com sucesso",
                usuarioCriado: {
                    id_usuario: results.insertId,
                    email: req.body.email
                }
            }
            return res.status(201).send(response)
    } catch (error){
        if (error) { return res.status(500).send({ error: error })}
    }
};

exports.login = async(req, res, next)=> {

    try{
        const query ='SELECT * FROM users WHERE email = ?';
        var result = await mysql.execute(query, [req.body.email])

        if(result.length < 1){
            return res.status(401).send({ mensagem: 'Falha na autenticação' })
        }

        if (await bcrypt.compareSync(req.body.senha, result[0].password)){
            const JWT_KEY = "segredo"; //chave para o token
            const token = jwt.sign({
                id_usuario: result[0].userId,
                email: result[0].email
            },
            JWT_KEY, //chave
            {
                expiresIn: "1h"    
            });
            return res.status(200).send({ 
                mensagem: 'Autenticado com sucesso',
                token: token

            })
        }

    }catch(error){
        return res.status(401).send({ mensagem: 'Falha na autenticação' })
    }


    mysql.getConnection((error, conn) => {
       if(error){ return res.status(500).send({ error: error}) }
        const query = 'SELECT * FROM users WHERE email = ?';
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
                    const JWT_KEY = "segredo"; //chave para o token
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    },
                    JWT_KEY, //chave
                    {
                        expiresIn: "1h"    
                    });
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token

                    })
                }

                return res.status(401).send({ mensagem: 'Falha na autenticação' })
           });
        });
    });
};