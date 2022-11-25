const mysql = require("../routes/mysql");

exports.getProducts = async(req, res, next) => {
    try{    

        // condição criara para o filtro funcionar caso não tiver o nome do produto com a categoria:
        // Exemplo: localhost:3000/products/?categoryId=1&name=ventilador
        // Dessa maneira, localhost:3000/products/?categoryId=1 assim também funciona.
        let name = '';
        if(req.query.name){
            name = req.query.name;
        }

        const query = `SELECT * 
                         FROM products
                        WHERE categoryId = ?
                          AND name LIKE '%${name}%';
                         `;
        const result = await mysql.execute(query,[req.query.categoryId]) //localhost:3000/products/?categoryId=1
        const response = {
            lenght: result.length,
            products: result.map(prod => {
                return{
                    productId: prod.productId,
                    name: prod.name,
                    price: prod.price,
                    productImage: prod.productImage,
                    request:{
                        type: 'GET',
                        description: 'Retorna os detalhes de um produto especifico',
                        url: 'http://localhost:3000/products/'+prod.productId
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch(error){
        return res.status(500).send(error);
    }
}

exports.postProducts = async (req, res, next) => {
    try{
        const query = 'INSERT INTO products (name, price, productImage, categoryId) VALUES (?,?,?,?)';
        const result = await mysql.execute(query, [
            req.body.name, 
            req.body.price,
            req.file.path,
            req.body.categoryId
        ]);
        const response = {
            message: 'Produto inserido com sucesso',
            createProduct:{
                productId: result.insertId,
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path,
                categoryId: req.body.categoryId,
                request:{
                    type: 'GET',
                    description: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/produtos' //lista de todos os produtos
                }               
            }
        }
        return res.status(201).send(response);
    }catch(error){ 
        return res.status(500).send({error: error});     
    }
};

exports.getProductDetail = async(req, res, next) => {

    try{
        const query = 'SELECT * FROM products WHERE productId = ?;';
        const result = await mysql.execute(query, [req.params.productId]);

        if (result.length ==0){
            return res.status(404).send({
                mensagem: 'Não foi encontrado produto com este ID'
            })
        }

        const response = {
            produto:{
                produtId: result[0].productId,
                name: result[0].name,
                price: result[0].price,
                productImage: result[0].productImage,
                request:{
                    type: 'GET',
                    descript: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/produtos' //lista de todos os produtos
                }           
            }
        }
        return res.status(200).send(response);
    }catch(error){ 
        return res.status(500).send({error: error});     
    }
};

exports.updateProducts = async (req, res, next) => {
    try{
        const query =` UPDATE products
                          SET name     = ?,
                              price    = ?
                        WHERE productId = ?`;
        
        await mysql.execute(query, [
                req.body.name, 
                req.body.price, 
                req.params.productId
            ]);

        const response = {
            mensagem: 'Produto atualizado com sucesso',
            productRefresh:{
                productId: req.params.productId,
                name: req.body.name,
                price: req.body.price,
                request:{
                    type: 'GET',
                    descript: 'Retorna os detalhes de um produto especifico',
                    url: 'http://localhost:3000/produtos/'+req.body.id_produto
                }             
            }
        }
            return res.status(202).send(response);
    } catch(error){
        return res.status(500).send( {error: error} );
    }         
};

exports.deleteProducts = async (req, res, next) => {
    try {
        const query = `DELETE FROM products WHERE productId = ?`;
        await mysql.execute(query, [req.params.productId]);

            const response={
                message: 'Produto removido com sucesso',
                request:{
                    tipo:'POST',
                    description:'Remove um produto',
                    url: 'http://localhost:3000/produtos',
                    body:{
                        name:'String',
                        price:'Number'
                    }
                }
            }
            res.status(202).send(response);
    }catch (error){
        res.status(202).send({ error: error });
    }
};

exports.postImagem = async (req, res, next) => {
    try{
        const query = 'INSERT INTO productImages (productId, path) VALUES (?,?)';
        const result = await mysql.execute(query, [
            req.params.productId, 
            req.file.path
        ]);
        const response = {
            message: 'Imagem inserido com sucesso',
            createImage:{
                productId: parseInt(req.params.productId),
                imageId: result.insertId,
                path: req.file.path,
                request:{
                    type: 'GET',
                    description: 'Retorna todas as imagens',
                    url: 'http://localhost:3000/produtos/'+req.params.productId+'/imagens'
                }               
            }
        }
        return res.status(201).send(response);
    }catch(error){ 
        return res.status(500).send({error: error.message});     
    }
};

exports.getImagens = async(req, res, next) => {
    try{    
        const query = 'SELECT * FROM productImages WHERE productId = ?;'
        const result = await mysql.execute(query, [req.params.productId])
        const response = {
            length: result.length,
            images: result.map(img => {
                return{
                    productId: parseInt(req.params.productId) ,
                    imageId: img.imageId,
                    path: img.path,
                    request:{
                        type: 'GET',
                        description: 'Retorna os detalhes de um produto especifico',
                        url: 'http://localhost:3000/produtos/'+img.productId
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch(error){
        return res.status(500).send(error);
    }
}