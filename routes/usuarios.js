const express = require('express');
const router = express.Router();
const mysql = require("./mysql").pool;
const bcrypt = require('bcrypt'); //Biblioteca para encriptar senha
const jwt = require('jsonwebtoken');
const UsuariosController = require('../controllers/usuarios-controller')

router.post('/cadastro', UsuariosController.cadastrarUsuario);

router.post('/login', UsuariosController.login);

module.exports = router;