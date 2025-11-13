const mysql = require("mysql2");
require("dotenv").config({
    path: ['.env']
});

const dataBase = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    queueLimit: process.env.DB_QUEUE_LIMIT
});

dataBase.getConnection((error, connection) => {
    if(error) throw error;
    else {
        console.log("Connection to MYSQL Database (pool)");
        connection.release();
    }
})

module.exports = dataBase.promise();