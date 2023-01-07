const mysql=require('mysql2');
const connection=mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"Password123",
    database: "myshop",
});

module.exports=connection;