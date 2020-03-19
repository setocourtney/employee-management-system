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
        console.log(`${newEmployee.first_name} ${newEmployee.last_name} has been added`);
        main();
    }).catch((err) => {console.error(err)});
}


//remove employee from db
const removeEmployee = async () => {
    const empToRemove = await getEmployee();
    const confirmRemove = await inquirer.prompt({
        type: "confirm",
        message: "Are you sure you want to remove employee?",
        name: "toRemove"
    });

    //if confirmed remove employee, else return to main menu
    if (confirmRemove.toRemove) {
        orm.remove("employees", "id", empToRemove.selectedEmp)
        .then(() => {
            console.log("Employee has been removed");
            main();
        }).catch((err) => console.error(err));
    } else {
        main();
    }

}

//update existing employee in db
const updateEmployee = async () => {
    const empToUpdate = await getEmployee();
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
        empToUpdate.selectedEmp
    ).then(() => {
        console.log(`${newInfo.first_name} ${newInfo.last_name} has been updated`);
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
    const selectedRole = await getRole();
    const roleInfo = await getRoleData();

    orm.set(
        "roles", {
            title: roleInfo.title,
            salary: roleInfo.salary,
            department_id: roleInfo.department
        },
        "id",
        selectedRole.selectedRole
    ).then(() => {
        console.log(`${roleInfo.title} has been updated`);
        main();
    }).catch((err) => {console.error(err)});
}


//remove role from db
const removeRole = async () => {
    const selectedRole = await getRole();
    const confirmRemove = await inquirer.prompt({
        type: "confirm",
        message: "Are you sure you want to remove role?",
        name: "toRemove"
    });

    //if confirmed remove role, else return to main menu
    if (confirmRemove.toRemove) {
        orm.remove("roles", "id", selectedRole.selectedRole)
        .then(() => {
            console.log("Role has been removed");
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
        console.log(`${newRole.title} has been added`);
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
    const selectedDept = await getDept();
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
        selectedDept.selectedDept
    ).then(() => {
        console.log(`${deptInfo.department} has been updated`);
        main();
    }).catch((err) => {console.error(err)});
}


//remove deptartment from db
const removeDept = async () => {
    const selectedDept = await getDept();
    const confirmRemove = await inquirer.prompt({
        type: "confirm",
        message: "Are you sure you want to remove department?",
        name: "toRemove"
    });

    if (confirmRemove.toRemove) {
        orm.remove("departmnets", "id", selectedDept.selectedDept)
        .then(() => {
            console.log("Department has been removed");
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


//
const getDepartmentBudget = () => {

}

const viewEmployeesByDept = () => {

}

const viewEmployeesByMgr = () => {
    
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


//prompts user to select an employee
const getEmployee = async () => {
    let employees = await orm.select("*", "employees");
    employees = employees.map((emp) => {
        return {
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }
    });

    return inquirer.prompt({
        type: "list",
        message: "Select Employee",
        name: "selectedEmp",
        choices: employees
    });

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


//prompt user to select department
const getDept = async () => {
    const departments = await getDepartments();

    return inquirer.prompt({
        type: "list",
        message: "Select role to update",
        name: "selectedDept",
        choices: departments
    });
}


//get current list of roles
const getRoles = async () => {
    let roles = await orm.select("*", "roles");
    roles = roles.map((role) => {
        return { name: role.title, value: role.id}
    });
    return roles;
}


//prompt user to select role
const getRole = async () => {
    const roles = await getRoles();

    return inquirer.prompt({
        type: "list",
        message: "Select role to update",
        name: "selectedRole",
        choices: roles
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

