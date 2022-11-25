const express = require('express');
const router = express.Router();
const multer = require('multer'); //Upload de imagens
const login = require('../middleware/login'); //Autenticação por rota JWT
const ImagensController = require('../controllers/image-controller') //Controlers

router.delete('/:imageId', login.required, ImagensController.deleteImagens);


module.exports = router;