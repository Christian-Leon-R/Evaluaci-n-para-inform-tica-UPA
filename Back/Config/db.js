const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'Christian_Alejandro_León_Rabanales', 
});

module.exports = pool.promise();
