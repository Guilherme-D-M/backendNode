const mysql = require("../routes/mysql");

exports.deleteImagens = async (req, res, next) => {
    try {
        const query = `DELETE FROM productImages WHERE imageId = ?`;
        await mysql.execute(query, [req.params.imageId]);

            const response={
                message: 'Imagem removida com sucesso',
                request:{
                    type:'POST',
                    decription:'Insere um produto',
                    url: 'http://localhost:3000/produtos/'+req.body.productId+'/image',
                    body:{
                        productId:'Number',
                        productImage:'File'
                    }
                }
            }
            res.status(202).send(response);
    }catch (error){
        res.status(202).send({ error: error });
    }
};