var mysql = require('mysql2');

var pool = mysql.createPool({
    "connectionLimit":1000,
    "user":"root",
    "password":"gui123",
    "database":"ecommerce",
    "host":"localhost",
    "port":"49155"
});

exports.execute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fields) =>{
            if(error){
                reject(error);
            } else{
                resolve(result)
            }
        });
    });
}

exports.pool = pool;