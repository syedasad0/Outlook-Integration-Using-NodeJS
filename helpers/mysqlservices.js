const mysql=require('mysql');
const CONFIG = require('./config.json');

//Create connection to mysql database
const connection=mysql.createConnection ({
 host:  CONFIG.mysqlCred.HOST,
 user:  CONFIG.mysqlCred.USER,
 password:  CONFIG.mysqlCred.PASSWORD,
 database:  CONFIG.mysqlCred.DATABASE
});

//Export database connection object
module.exports=connection;