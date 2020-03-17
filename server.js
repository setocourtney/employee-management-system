const inquirer = require("inquirer");
const orm = require("./config/orm.js");

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

const main = () => {
    inquirer.prompt(
        getAction()
    ).then((answer) =>{
        runAction(answer.action);
    })
    .catch((err) => {
        err.message;
        orm.end();
    });
};

main();

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

//application functions

const viewAllEmployees = () => {
    orm.allEmployeeData((results) => {
        console.log("\n");
        console.table(results);
        main();
    });
}

const addEmployee = async () => {
    //select: (selection, table, cb)
    const roles = await orm.select(
            "*",
            "roles"
    );
    console.log(roles);

    console.log(orm.select("*","roles"));
    
    // (results) => {
    //     let listRoles = results.map((result) => {
    //         return { name: result.title, value: result.id}
    //     });
    //     console.log(listRoles);
    //     return listRoles;
    // }




    const managers = await orm.select(
        "id, CONCAT(first_name, \" \", last_name) AS manager",
        "employees",
        (results) => {
            let listEmployees = results.map((result) => {
                return { name: result.manager, value: result.id}
            });
            listEmployees.push({ name: "No Manager", value: 0 });
            console.log(listEmployees);
            return listEmployees;
        }
    );

    console.log(managers);

    const questions = [{
        type: "input",
        message: "Enter Employee Last Name",
        name: "last_name",
        validate: async (input) => {
            if (!input.match("^[a-zA-Z]+$")) {
               return 'Please enter a valid name';
            }
      
            return true;
         }
    },
    {
        type: "input",
        message: "Enter Employee First Name",
        name: "last_name",
        validate: async (input) => {
            if (!input.match("^[a-zA-Z]+$")) {
               return 'Please enter a valid name';
            }
      
            return true;
         }
    },
    {
        type: "list",
        message: "Select Employee Role",
        name: "role",
        choices: roles
    },
    {
        type: "list",
        message: "Select Employee Manager",
        name: "manager",
        choices: managers
    }];

    const newEmployee = await inquirer.prompt(questions);
    
    //insert: (table, cols, values, cb)
    // orm.insert(
    //     "employees", 
    //     ["last_name", "first_name", "role_id", "manager_id"], 
    //     [newEmployee.last_name, newEmployee.first_name, newEmployee.role.value, newEmployee.manager.value],
    //     (results) => {
    //         viewAllEmployees();
    //     }
    // );
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

const viewEmployeesByDept = () => {
    let allDepts;

    //select: (selection, table, cb)
    orm.select(
        "department",
        "departments",
        (results) => {
            allDepts = results.map((result) => result.department);
            console.log(allDepts);
            
            inquirer.prompt({
                type: 'list',
                message: 'Select a department',
                name: 'department',
                choices: allDepts
            }).then((answer) => {
                //triple join

            })

            main();
        }
    );
}

const viewEmployeesByMgr = () => {
    
};