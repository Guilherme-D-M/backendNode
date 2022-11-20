const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const JWT_KEY = "segredo"; //chave para o token
    try{
        const decode = jwt.verify(req.body.token, JWT_KEY)
        req.usuario = decode;
        next();
    }catch(error){
        return res.status(401).send({  mensagem: 'Falha na autenticação' });
    }
    
}
