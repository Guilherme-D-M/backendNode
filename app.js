const express = require('express'); //Importa o express
const app = express(); //Variavel que cria uma instancia do express
const morgan = require('morgan'); //Importa o Morgan
const bodyParser = require('body-parser'); //Importa o body Parser

//cria a rota
const productRoute = require('./routes/product-route');
const orderRoute = require('./routes/order-route');
const userRoute = require('./routes/user-route');
const imagesRoute = require('./routes/image-route');
const categoryRoute = require('./routes/category-route');

app.use(morgan('dev')); //Mostra o log da API no console

app.use('/uploads', express.static('uploads'))//disponibilizar a imagem globalmente, podendo ser acessada pelo localhost

app.use(bodyParser.urlencoded({ extended: false })); //apenas dados simples
app.use(bodyParser.json()); //json de entrada

//chama a rota
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/users', userRoute);
app.use('/image', imagesRoute);
app.use('/category', categoryRoute);

//CORS
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*'); //origem que será aceito

    res.header('Access-Control-Allow-Header', //cabeçalhos que serão aceitos
    'Origin, X-Requrested-With,Content-Type, Accept, Authorization'
    );
    
    if (req.method == 'OPTIONS'){ //métodos que serão aceitos
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next(); //continua 
})

//Tratamento caso não encontre rota
app.use((req, res, next)=>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro : {
            mensagem: error.message
        }
    })
})

//Exporta os módulos
module.exports = app;