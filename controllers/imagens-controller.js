const mysql = require("../routes/mysql");

exports.deleteImagens = async (req, res, next) => {
    try {
        const query = `DELETE FROM imagens_produtos WHERE id_imagem = ?`;
        await mysql.execute(query, [req.params.id_imagem]);

            const response={
                mensagem: 'Imagem removida com sucesso',
                request:{
                    tipo:'POST',
                    descricao:'Insere um produto',
                    url: 'http://localhost:3000/produtos/'+req.body.id_produto+'/imagem',
                    body:{
                        id_produto:'Number',
                        imagem_produto:'File'
                    }
                }
            }
            res.status(202).send(response);
    }catch (error){
        res.status(202).send({ error: error });
    }
};