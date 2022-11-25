const express = require('express');
const router = express.Router();
const multer = require('multer'); //Upload de imagens
const login = require('../middleware/login'); //Autenticação por rota JWT

const categoryController = require('../controllers/category-controller') //Controlers

router.get('/', categoryController.getCategories);

router.post(
    '/', 
    login.required, 
    categoryController.postCategory
);
module.exports = router;