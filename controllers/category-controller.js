const mysql = require("../routes/mysql");

exports.getCategories = async(req, res, next) => {
    try{    
        const result = await mysql.execute('SELECT * FROM categories;')
        const response = {
            lenght: result.length,
            categories: result.map(category => {
                return{
                    categoryId: category.categoryId,
                    name: category.name,
                }
            })
        }
        return res.status(200).send(response);
    } catch(error){
        return res.status(500).send(error);
    }
}

exports.postCategory = async (req, res, next) => {
    try{
        const query = 'INSERT INTO categories (name) VALUES (?)';
        const result = await mysql.execute(query, [req.body.name]);
        const response = {
            message: 'Categoria inserida com sucesso',
            createdCategory:{
                categoryId: result.insertId,
                name: req.body.name,
                request:{
                    type: 'GET',
                    description: 'Retorna todas as categorias',
                    url: 'http://localhost:3000/categories' //lista de todos os produtos
                }               
            }
        }
        return res.status(201).send(response);
    }catch(error){ 
        return res.status(500).send({error: error});     
    }
};
