const mysql = require("mysql2");

const dataBase = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "superman38!",
    database: "rental",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

dataBase.getConnection((error, connection) => {
    if(error) throw error;
    else {
        console.log("Connection to MYSQL Database (pool)");
        connection.release();
    }
})

module.exports = dataBase.promise();