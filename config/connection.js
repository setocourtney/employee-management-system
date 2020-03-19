const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employees_DB"
});

connection.connect((err) => {
    if (err) {
        console.log(`Error with Connection: ${err.stack}`);
        return;
    }
    console.log(`Connected to Server at port: ${connection.threadId}`);
});

module.exports = connection;