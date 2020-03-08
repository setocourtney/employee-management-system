const inq = require("inquirer");
const orm = require("./config/orm.js");

//add department
orm.insert(departments, ["name"], ["Facilities"], (result) => {
    console.table(result);
});

//add role

//add employee

//view joined

//view departments

//view roles

//view employees

//update employee role

//update employee manager

// view employees by manager

//view budget for department