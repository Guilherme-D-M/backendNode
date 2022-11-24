const express = require('express');
const router = express.Router();
const multer = require('multer'); //Upload de imagens
const login = require('../middleware/login'); //Autenticação por rota JWT
const ProdutosController = require('../controllers/produtos-controller') //Controlers

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
router.get('/', ProdutosController.getProdutos);

// Insere um produto
router.post(
    '/', 
    login.obrigatorio, 
    upload.single('produto_imagem'), 
    ProdutosController.postProdutos
);

// Retorna os dados de um produto
router.get('/:id_produto', ProdutosController.getUmProduto);

// Altera um produto
router.patch('/', login.obrigatorio, ProdutosController.updateProdutos);

// Exclui um produto
router.delete('/', login.obrigatorio, ProdutosController.deleteProdutos);

router.post('/:id_produto/imagem',
    login.obrigatorio,
    upload.single('produto_imagem'),
    ProdutosController.postImagem      
);

router.get('/:id_produto/imagens',
    ProdutosController.getImagens  
);

// Quando chama a referencia dos produtos, exporta os modulos
module.exports = router;