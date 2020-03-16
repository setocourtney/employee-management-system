const inquirer = require("inquirer");
const orm = require("./config/orm.js");


const main = async () => {
    try {
        const newAction = await inquirer.prompt(getAction());
        runAction(newAction.action);
    } catch (err) {
        err.message;
        orm.end();
    }
};

main();

//list application action choices and returns prompt object
const getAction = () => {
    const choices = [{
        name: "End Session",
        value: "end"
    },
    {
        name: "View All Employees",
        value: "viewAllEmployees"
    },
    {
        name: "View All Employees By Department",
        value: "viewEmployeesByDept"
    },
    {
        name:"View All Employees By Manager",
        value : "viewEmployeesByMgr"
    },
    {
        name: "Add Employee",
        value: "addEmployee"
    },
    {
        name: "Remove Employee",
        value: "removeEmployee"
    },
    {
        name: "Update Employee",
        value: "updateEmployee"
    },
    {
        name: "Update Employee Manager",
        value: "updateEmployeeManager"
    },
    {
        name: "View All Roles",
        value: "viewRoles"
    },
    {
        name: "Add New Role",
        value: "addRole"
    },
    {
        name: "Remove Role",
        value: "removeRole"
    },
    {
        name: "View all Departments",
        value: "viewDepartments"
    },
    {
        name: "Add New Department",
        value: "addDepartment"
    },
    {
        name: "Remove Department",
        value: "removeDepartment"
    },
    {
        name: "Department Budget",
        value: "getDepartmentBudget"
    }];
    return {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: choices
    };
};

//runs function based on answer to action prompt
const runAction = (action) => {
    switch (action) {
        case "end" : 
            return orm.end();
        case "viewAllEmployees":
            return viewAllEmployees();
        case "viewEmployeesByDept":
            return viewEmployeesByDept();
        case "viewEmployeesByMgr":
            return viewEmployeesByMgr();
        case "addEmployee":
            return addEmployee();
        case "removeEmployee":
            return removeEmployee();
        case "updateEmployee":
            return updateEmployee();
        case "updateEmployeeManager":
            return updateEmployeeManager();
        case "viewRoles":
            return viewRoles();
        case "addRole":
            return addRole();
        case "removeRole":
            return removeRole();
        case "viewDepartments":
            return viewDepartments();
        case "addDepartment":
            return addDepartment();
        case "removeDepartment":
            return removeDepartment();
        case "getDepartmentBudget":
            return getDepartmentBudget();
        default:
            return orm.end();
    };
}

//application function
//add department
    //insert(table, cols, values, cb)

const viewAllEmployees = () => {
    return orm.allEmployeeData((results) => {
        console.log("\n");
        console.table(results);
        main();
    });
}

const viewEmployeesByDept = () => {

}

const viewEmployeesByMgr = () => {
    
}

const addEmployee = () => {
    
}

const removeEmployee = () => {

}

const updateEmployee = () => {

}

const updateEmployeeManager = () => {

}

const viewRoles = () => {

}

const addRole = () => {

}

const removeRole = () => {

}

const viewDepartments = () => {

}

const addDepartment = () => {

}

const removeDepartment = () => {

}

const getDepartmentBudget = () => {

}
    //select(selection, table, cb)

//view data from two tables
    //doubleJoin(selection, tOne, tTwo, key1, key2, cb)

//view employees
    //getEmployeeData(cb)

//update employee role
    //set(table, newValues, criteria, cb)

//update employee manager
    // orm.set("employees",{manager_id: 3}, {id: 2}, (result) => {
    //     console.table(result);
    // });

// view employees by manager

// view budget for department