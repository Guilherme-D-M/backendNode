const jwt = require('jsonwebtoken');

//obrigatório a autenticação
exports.required = (req, res, next) => {
    const JWT_KEY = "segredo"; //chave para o token
    try{
        //split reliazado por causa que no postmann é inserido no headers da seguinte forma:
        //Bearer TOKEN
        //necessário pegar só o token, por isso separa por espaço e pega a segunda posição que é o token
        const token =  req.headers.authorization.split(' ')[1] 
        const decode = jwt.verify(token, JWT_KEY)
        req.user = decode;
        next();
    }catch(error){
        return res.status(401).send({  mensagem: 'Falha na autenticação' });
    }
}

//Quando não é obrigatório autenticar o JWT, porém é preciso utilizar os dados do JWT para determinada ação
//Por exemplo, é necessário o id_user para incluir

exports.optional = (req, res, next) => {
    const JWT_KEY = "segredo"; //chave para o token
    try{
        //split reliazado por causa que no postmann é inserido no headers da seguinte forma:
        //Bearer TOKEN
        //necessário pegar só o token, por isso separa por espaço e pega a segunda posição que é o token
        const token =  req.headers.authorization.split(' ')[1] 
        const decode = jwt.verify(token, JWT_KEY)
        req.user = decode;
        next();
    }catch(error){
        next();
    }
}

