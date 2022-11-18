var mysql = require('mysql2');

var pool = mysql.createPool({
    "user":"root",
    "password":"gui123",
    "database":"ecommerce",
    "host":"localhost",
    "port":"49155"
});

exports.pool = pool;