const inquirer = require("inquirer");
const orm = require("./config/orm.js");
const ctable = require("console.table");

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
        name: "Manage Roles",
        value: "manageRoles"
    },
    {
        name: "Manage Departments",
        value: "manageDepartments"
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
        case "manageRoles":
            return manageRoles();
        case "manageDepartments":
            return manageDepartments();
        case "getDepartmentBudget":
            return getDepartmentBudget();
        default:
            return orm.end();
    };
}



// ------- application functions -------

//display table of all employee data including role, salary, department, and manager
const viewAllEmployees = async () => {
    orm.allEmployeeData().then((results) => {
        console.log("\n");
        console.table(results);
        main();
    }).catch((err) => {console.error(err)});
};


//create new employee in db
const addEmployee = async () => {
    const newEmployee = await getEmployeeData();
    orm.insert(
        "employees", 
        ["last_name", "first_name", "role_id", "manager_id"], 
        [newEmployee.last_name, newEmployee.first_name, newEmployee.role, newEmployee.manager]
    ).then(() => {
        console.log(`\n ${newEmployee.first_name} ${newEmployee.last_name} has been added \n`);
        main();
    }).catch((err) => {console.error(err)});
}


//remove employee from db
const removeEmployee = async () => {
    const employees = await getEmployees();
    const empToRemove = await getSelection(employees, "employee");
    const confirmRemove = await confirm();

    //if confirmed remove employee, else return to main menu
    if (confirmRemove.toContinue) {
        orm.remove("employees", "id", empToRemove.name)
        .then(() => {
            console.log(`\n Employee has been removed \n`);
            main();
        }).catch((err) => console.error(err));
    } else {
        main();
    }

}

//update existing employee in db
const updateEmployee = async () => {
    const employees = await getEmployees();
    const empToUpdate = await getSelection(employees, "employee");
    const newInfo = await getEmployeeData();

    //update employee based on id
    orm.set(
        "employees", 
        {
            last_name: newInfo.last_name,
            first_name: newInfo.first_name,
            role_id: newInfo.role,
            manager_id: newInfo.manager
        },
        "id",
        empToUpdate.name
    ).then(() => {
        console.log(`\n ${newInfo.first_name} ${newInfo.last_name} has been updated \n`);
        main();
    }).catch((err) => {console.error(err)});
}


//prompt series of actions to manage roles
const manageRoles = async () => {
    const roleAction = await inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: ["Update Existing", "Remove", "Add New", "Return to Main Menu"]
    });

    switch (roleAction.action) {
        case "Update Existing":
            return updateRole();
        case "Remove":
            return removeRole();
        case "Add New":
            return createRole();
        default:
            return main();
    }
}


//update existing role in db
const updateRole = async () => {
    const roles = await getRoles();
    const selectedRole = await getSelection(roles, "role");
    const roleInfo = await getRoleData();

    orm.set(
        "roles", {
            title: roleInfo.title,
            salary: roleInfo.salary,
            department_id: roleInfo.department
        },
        "id",
        selectedRole.name
    ).then(() => {
        console.log(`\n ${roleInfo.title} has been updated \n`);
        main();
    }).catch((err) => {console.error(err)});
}


//remove role from db
const removeRole = async () => {
    const roles = await getRoles();
    const selectedRole = await getSelection(roles, "role");
    const confirmRemove = await confirm();

    //if confirmed remove role, else return to main menu
    if (confirmRemove.toContinue) {
        orm.remove("roles", "id", selectedRole.name)
        .then(() => {
            console.log(`\n Role has been removed \n`);
            main();
        }).catch((err) => console.error(err));
    } else {
        main();
    }
}

//create new role in db
const createRole = async () => {
    const newRole = await getRoleData();
    orm.insert(
        "roles", 
        ["title", "salary", "department_id"], 
        [newRole.title, newRole.salary, newRole.department]
    ).then(() => {
        console.log(`\n ${newRole.title} has been added \n`);
        main();
    }).catch((err) => {console.error(err)});
}


//prompt series of actions to manage departments
const manageDepartments = async () => {
    const deptAction = await inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: ["Update Existing", "Remove", "Add New", "Return to Main Menu"]
    });

    switch (deptAction.action) {
        case "Update Existing":
            return updateDept();
        case "Remove":
            return removeDept();
        case "Add New":
            return createDept();
        default:
            return main();
    }
}


//update existing dept in db
const updateDept = async () => {
    const depts = await getDepartments();
    const selectedDept = await getSelection(depts, "department");
    const deptInfo = await inquirer.prompt({
        type: "input",
        message: "What is the Department Name?",
        name: "department",
        validate: async (input) => {
            if (!input.match("^[a-zA-Z]+$")) {
               return 'Please enter a valid name';
            }
            return true;
         }
    });

    orm.set(
        "departments", {
            department: deptInfo.department
        },
        "id",
        selectedDept.name
    ).then(() => {
        console.log(`\n ${deptInfo.department} has been updated \n`);
        main();
    }).catch((err) => {console.error(err)});
}


//remove deptartment from db
const removeDept = async () => {
    const depts = await getDepartments();
    const selectedDept = await getSelection(depts, "department");
    const confirmRemove = await confirm();

    if (confirmRemove.toContinue) {
        orm.remove("departmnets", "id", selectedDept.name)
        .then(() => {
            console.log(`\n Department has been removed \n`);
            main();
        }).catch((err) => console.error(err));
    } else {
        main();
    }
}


//add new department to db
const createDept = async () => {
    const newDept = await inquirer.prompt({
        type: "input",
        message: "What is the Department Name?",
        name: "department",
        validate: async (input) => {
            if (!input.match("^[a-zA-Z]+$")) {
               return 'Please enter a valid name';
            }
            return true;
         }
    });

    orm.insert(
        "departments", 
        ["department"], 
        [newDept.department]
    ).then(() => {
        console.log(`${newDept.department} has been added`);
        main();
    }).catch((err) => {console.error(err)});
}


//view all employees for selected department
const viewEmployeesByDept = async () => {
    const depts = await getDepartments();
    const selectedDept = await getSelection(depts, "department");
    orm.doubleJoinWhere(
        "tOne.last_name, tOne.first_name, tTwo.title, tTwo.salary, tOne.manager_id",
        "employees",
        "roles",
        "role_id",
        "id",
        "tTwo.department_id",
        selectedDept.name
    ).then((results) => {
        console.log(`\n Department Employees: \n`);
        if(results.length > 0) {
            console.table(results);
        } else {
            console.log(`No employees to display \n`);
        }
        main();
    }).catch((err) => {console.error(err)});
}


//view all employees of selected manager
const viewEmployeesByMgr = async () => {
    const managers = await getManagers();

    const selectedMgr = await getSelection(managers, "manager")

    orm.doubleJoinWhere(
        "tOne.last_name, tOne.first_name, tTwo.title, tTwo.salary, tOne.manager_id",
        "employees",
        "roles",
        "role_id",
        "id",
        "tOne.manager_id",
        selectedMgr.name
    ).then((results) => {
        console.log(`\n Manager Employees: \n`);
        if(results.length > 0) {
            console.table(results);
        } else {
            console.log(`\n No employees to display \n`);
        }
        main();
    }).catch((err) => {console.error(err)});
};




// ----- helper methods ------

//prompts user for input on all employee fields
const getEmployeeData = async () => {
    const roles = await getRoles();
    const managers = await getManagers();


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
        name: "first_name",
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

    return inquirer.prompt(questions);
}


//get current list of employees
const getEmployees = async () => {
    let employees = await orm.select("*", "employees");
    employees = employees.map((emp) => {
        return {
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }
    });
    return employees;
}


//prompt user for role information
const getRoleData = async () => {
    const departments = await getDepartments();

    const questions = [{
        type: "input",
        message: "What is the Role Title?",
        name: "title",
        validate: async (input) => {
            if (!input.match("^[a-zA-Z]+$")) {
               return 'Please enter a valid name';
            }
            return true;
         }
    },
    {
        type: "input",
        message: "What is the salary?",
        name: "salary",
        validate: async (input) => {
            if (!input.match("^[a-^[0-9]*$")) {
               return 'Please enter numbers only';
            }
            return true;
         }
    },
    {
        type: "list",
        message: "What department does this role report to?",
        name: "department",
        choices: departments
    }];

    return inquirer.prompt(questions);

}


//get existing departments
const getDepartments = async () => {
    let departments = await orm.select("*", "departments");
    departments = departments.map((dept) => {
        return { name: dept.department, value: dept.id}
    });
    return departments;
}


//get current list of roles
const getRoles = async () => {
    let roles = await orm.select("*", "roles");
    roles = roles.map((role) => {
        return { name: role.title, value: role.id}
    });
    return roles;
}


//prompt user for selection from list
const getSelection = async (array, field) => {
    return inquirer.prompt({
        type: "list",
        message: `Select ${field}`,
        name: "name",
        choices: array
    });
}


//get current list of managers
const getManagers = async () => {
    let managers = await orm.select("id, CONCAT(first_name, \" \", last_name) AS manager","employees");
    managers = managers.map((mgr) => {
        return { name: mgr.manager, value: mgr.id}
    });
    managers.push({ name: "No Manager", value: 0 }); //handle no manager input
    return managers;
}

//confirm continue
const confirm = async () => {
    return inquirer.prompt({
        type: "confirm",
        message: "Are you sure you want to continue?",
        name: "toContinue"
    });
}

