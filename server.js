const mysql = require("mysql");
const inq = require("inquirer");
const orm = require("./config/orm.js");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password1",
    database: "employees_DB"
});

connection.connect((err) => {
    if (err) {
        console.log(`Error with Connection: ${err.stack}`);
        return;
    }
    console.log(`Connected to Server at port: ${connection.threadId}`);
});