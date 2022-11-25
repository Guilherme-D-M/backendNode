const express = require('express');
const router = express.Router();
const multer = require('multer'); //Upload de imagens
const login = require('../middleware/login'); //Autenticação por rota JWT

const productsController = require('../controllers/product-controller') //Controlers

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
router.get('/', productsController.getProducts);

// Insere um produto
router.post(
    '/', 
    login.required, 
    upload.single('productImage'),
    productsController.postProducts
);

// Retorna os dados de um produto
router.get('/:productId', productsController.getProductDetail);

// Altera um produto
router.patch('/:productId', login.required, productsController.updateProducts);

// Exclui um produto
router.delete('/:productId', login.required, productsController.deleteProducts);

router.post('/:productId/image',
    login.required,
    upload.single('productImage'),
    productsController.postImagem      
);

router.get('/:productId/images',
    productsController.getImagens  
);

// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;