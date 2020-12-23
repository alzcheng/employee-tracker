const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Todo: 
// 1) Setup error handling for numbers
// 2) Setup escapes for addition, update, and delete
// 3) Setup warnings for delete for cascade
// 4) Need to add null for add employee's manager

//Connect to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_db"
});

connection.connect(err => {
    if (err) throw err;
    console.log("database connected");
    mainMenu();
});

const mainMenu = () => {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Which action would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "View all employees by manager",
            "View the total utilized budget of a department",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update employee's role",
            "Update employee's manager",
            "Delete a department",
            "Delete a role",
            "Delete an employee",
            "Exit program"
        ],
    }).then((userResponse) => {
        console.log(userResponse.action);
        switch (userResponse.action) {
            case "View all departments":
                viewDepartment();
                break;
            case "View all roles":
                viewRole();
                break;
            case "View all employees":
                viewEmployee();
                break;
            case "View all employees by manager":
                viewEmpByMgr();
                break;
            case "View the total utilized budget of a department":
                viewDeptBudget();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update employee's role":
                updateEmpRole();
                break;
            case "Update employee's manager":
                updateEmpMgr();
                break;
            case "Delete a department":
                deleteDepartment();
                break;
            case "Delete a role":
                deleteRole();
                break;
            case "Delete an employee":
                deleteEmployee();
                break;

            default:
                connection.end();
                process.exit(0);
                break;
        }
    })
};

// -------------------- Viewing the Database --------------------------

const viewDepartment = () => {
    connection.query(
        "SELECT * FROM department", (err, data) => {
            if (err) throw err;
            console.log("\n");
            console.table(data);
            mainMenu();
        }
    )
}

const viewRole = () => {
    connection.query(
        `SELECT role.id, role.title, role.salary, department.name "department"
        FROM role
        INNER JOIN department ON role.department_id = department.id;`, (err, data) => {
        if (err) throw err;
        console.log("\n");
        console.table(data);
        mainMenu();
    }
    )
}

const viewEmployee = () => {
    connection.query(
        `SELECT E1.id, E1.first_name, E1.last_name, role.title, role.salary, department.name, CONCAT(E2.first_name," ", E2.last_name) "manager"
        FROM employee E1
        INNER JOIN role ON role.id = E1.role_id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee E2 ON E1.manager_id = E2.id;`, (err, data) => {
        if (err) throw err;
        console.log("\n");
        console.table(data);
        mainMenu();
    }
    )
}

const viewEmpByMgr = () => {
    connection.query(
        `SELECT id, CONCAT(first_name, " ", last_name) "mgr_name" FROM employee;`,
        (err, data) => {
            if (err) throw err;
            const mgr_id = [];
            const mgr_names = [];
            data.forEach(item => {
                mgr_id.push(item.id);
                mgr_names.push(item.mgr_name);
            })
            viewEmpByMgrSelect(mgr_id, mgr_names);
        }
    )
}

const viewEmpByMgrSelect = (mgr_id, mgr_names) => {
    inquirer
        .prompt([
            {
                name: "selected_mgr",
                type: "list",
                message: "Which manager's employees do you want to see?",
                choices: mgr_names
            }
        ]).then(({ selected_mgr }) => {
            const mgr_index = mgr_names.findIndex(item => item === selected_mgr);
            connection.query(
                `SELECT E1.id, E1.first_name, E1.last_name, role.title, role.salary, department.name, CONCAT(E2.first_name," ", E2.last_name) "manager"
            FROM employee E1
            INNER JOIN role ON role.id = E1.role_id
            INNER JOIN department ON role.department_id = department.id
            INNER JOIN employee E2 ON E1.manager_id = E2.id WHERE E2.id = ?;`,
                mgr_id[mgr_index],
                (err, data) => {
                    if (err) throw err;
                    console.log("\n");
                    console.table(data);
                    mainMenu();
                }
            )
        })
}

const viewDeptBudget = () => {
    connection.query(
        `SELECT * FROM department`, (err, data) => {
            if (err) throw err;
            const dept_id = [];
            const dept_names = [];
            data.forEach(item => {
                dept_id.push(item.id);
                dept_names.push(item.name);
            })
            viewDeptBudgetSelect(dept_id, dept_names);
        }
    )
};

const viewDeptBudgetSelect = (dept_id, dept_names) => {
    inquirer.prompt([
        {
            name: "department_name",
            type: "list",
            message: "Which department's budget would you like to see?",
            choices: dept_names
        },
    ]).then(({ department_name }) => {
        const index = dept_names.findIndex((item) => item === department_name);
        connection.query(
            `SELECT SUM(role.salary) "Total Department Budget"
            FROM employee
            INNER JOIN role ON role.id = employee.role_id
            INNER JOIN department ON role.department_id = department.id
            WHERE department.id = ?;`, dept_id[index], (err, data) => {
            if (err) throw err;
            console.log("\n");
            console.table(data);
            mainMenu();
        }
        )
    });
}



// -------------------- Adding to the Database --------------------------

const addDepartment = () => {
    inquirer.prompt(
        {
            name: "department_name",
            type: "input",
            message: "What is the name of the new department?"
        }
    ).then((userResponse) => {
        connection.query(
            "INSERT INTO department (name) VALUE (?)", userResponse.department_name, (err, data) => {
                if (err) throw err;
                mainMenu();
            }
        )
    })
}

const addRole = () => {
    connection.query(
        `SELECT * FROM department`, (err, data) => {
            if (err) throw err;
            const dept_id = [];
            const dept_names = [];
            data.forEach(item => {
                dept_id.push(item.id);
                dept_names.push(item.name);
            });
            addRoleSelect(dept_id, dept_names);
        }
    )
};

const addRoleSelect = (dept_id, dept_names) => {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title of the role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of the role?"
            //Need to add validation
        },
        {
            name: "department_name",
            type: "list",
            message: "Which department does this role belong to?",
            choices: dept_names
        },
    ]).then(({ title, salary, department_name }) => {
        const index = dept_names.findIndex((item) => item === department_name);
        connection.query(
            "INSERT INTO role (title, salary, department_id) VALUE (?,?,?)", [title, salary, dept_id[index]], (err) => {
                if (err) throw err;
                mainMenu();
            }
        )
    });
}

const addEmployee = () => {
    connection.query(
        `SELECT id, title FROM role;`,
        (err, data) => {
            if (err) throw err;
            const role_id = [];
            const role_titles = [];
            data.forEach(item => {
                role_id.push(item.id);
                role_titles.push(item.title);
            });
            connection.query(
                'SELECT id, CONCAT(first_name, " ", last_name) "mgr_name" FROM employee',
                (err, data) => {
                    if (err) throw err;
                    //Need to insert case for NULL
                    const mgr_id = [];
                    const mgr_names = [];
                    data.forEach(item => {
                        mgr_id.push(item.id);
                        mgr_names.push(item.mgr_name);
                    });
                    addEmployeeSelect(role_id, role_titles, mgr_id, mgr_names);
                }
            )
        }
    )
};

const addEmployeeSelect = (role_id, role_titles, mgr_id, mgr_names) => {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the first name of the employee?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the last name of the employee?"
        },
        {
            name: "selected_role",
            type: "list",
            message: "What role does this new employee have?",
            choices: role_titles
        },
        {
            name: "selected_mgr",
            type: "list",
            message: "Who is this employee's manager?",
            choices: mgr_names
        },
    ]).then(({ first_name, last_name, selected_role, selected_mgr }) => {
        const role_index = role_titles.findIndex(item => item === selected_role);
        const mgr_index = mgr_names.findIndex(item => item === selected_mgr);
        connection.query(
            `INSERT INTO employee(first_name, last_name, role_id, manager_id) 
            VALUE(?, ?, ?, ?);`,
            [first_name, last_name, role_id[role_index], mgr_id[mgr_index]],
            (err) => {
                if (err) throw err;
                mainMenu();
            }
        )

    })
}

// -------------------- Updating the Database --------------------------

const updateEmpRole = () => {
    connection.query(
        `SELECT id, CONCAT(first_name, " ", last_name) "employee_name" FROM employee;`,
        (err, data) => {
            if (err) throw err;
            const emp_id = [];
            const emp_names = [];
            data.forEach(item => {
                emp_id.push(item.id);
                emp_names.push(item.employee_name);
            })
            connection.query(
                `SELECT id, title FROM role;`,
                (err, data) => {
                    if (err) throw err;
                    const role_id = [];
                    const role_titles = [];
                    data.forEach(item => {
                        role_id.push(item.id);
                        role_titles.push(item.title);
                    })
                    updateEmpRoleSelect(emp_id, emp_names, role_id, role_titles);
                }
            )
        }
    )
}


const updateEmpRoleSelect = (emp_id, emp_names, role_id, role_titles) => {
    inquirer.prompt([
        {
            name: "selected_emp",
            type: "list",
            message: "Please select the employee whose role you are trying to update.",
            choices: emp_names
        },
        //Need to be able to exit 
        {
            name: "selected_role",
            type: "list",
            message: "Please choose the new role.",
            choices: role_titles
        }

    ]).then(({ selected_emp, selected_role }) => {
        const emp_index = emp_names.findIndex(item => item === selected_emp);
        const role_index = role_titles.findIndex(item => item === selected_role);
        connection.query(
            `UPDATE employee
            SET role_id = ?
            WHERE id = ?;`,
            [role_id[role_index], emp_id[emp_index]],
            (err) => {
                if (err) throw err;
                mainMenu();
            }
        )
    })
}

const updateEmpMgr = () => {
    connection.query(
        `SELECT id, CONCAT(first_name, " ", last_name) "employee_name" FROM employee;`,
        (err, data) => {
            if (err) throw err;
            const emp_id = [];
            const emp_names = [];
            data.forEach(item => {
                emp_id.push(item.id);
                emp_names.push(item.employee_name);
            })
            connection.query(
                `SELECT id, CONCAT(first_name, " ", last_name) "mgr_name" FROM employee;`,
                (err, data) => {
                    if (err) throw err;
                    const mgr_id = [];
                    const mgr_names = [];
                    data.forEach(item => {
                        mgr_id.push(item.id);
                        mgr_names.push(item.mgr_name);
                    })
                    updateEmpMgrSelect(emp_id, emp_names, mgr_id, mgr_names);
                }
            )
        }
    )
};

const updateEmpMgrSelect = (emp_id, emp_names, mgr_id, mgr_names) => {
    inquirer.prompt([
        {
            name: "selected_emp",
            type: "list",
            message: "Please select the employee whose manager you are trying to update.",
            choices: emp_names
        },
        //Need to be able to not choose yourself as manager, also allow for null
        {
            name: "selected_mgr",
            type: "list",
            message: "Please choose the new manager.",
            choices: mgr_names
        }

    ]).then(({ selected_emp, selected_mgr }) => {
        const emp_index = emp_names.findIndex(item => item === selected_emp);
        const mgr_index = mgr_names.findIndex(item => item === selected_mgr);
        connection.query(
            `UPDATE employee
            SET manager_id = ?
            WHERE id = ?;`,
            [mgr_id[mgr_index], emp_id[emp_index]],
            (err) => {
                if (err) throw err;
                mainMenu();
            }
        )
    })
}


//-----------------Deleting in the database -----------------

// Need to setup warnings
const deleteEmployee = () => {
    connection.query(
        `SELECT id, CONCAT(first_name, " ", last_name) "name" FROM employee`, (err, data) => {
            if (err) throw err;
            const emp_id = [];
            const emp_names = [];
            data.forEach(item => {
                emp_id.push(item.id);
                emp_names.push(item.name);
            })
            deleteEmpSelect(emp_id, emp_names);
        }
    )
}

const deleteEmpSelect = (emp_id, emp_names) => {
    inquirer
        .prompt([
            {
                name: "selected_emp",
                type: "list",
                message: "Which employee would you like to delete?",
                choices: emp_names,
            }
        ]).then(({ selected_emp }) => {
            const index = emp_names.findIndex(item => item === selected_emp);
            connection.query(
                `DELETE FROM employee WHERE id = ?`,
                emp_id[index],
                (err) => {
                    if (err) throw err;
                    mainMenu();
                }
            )
        })
};

const deleteRole = () => {
    connection.query(
        `SELECT id, title FROM role`, (err, data) => {
            if (err) throw err;
            const role_id = [];
            const role_names = [];
            data.forEach(item => {
                role_id.push(item.id);
                role_names.push(item.title);
            })
            deleteRoleSelect(role_id, role_names);
        }
    )
}

const deleteRoleSelect = (role_id, role_names) => {
    inquirer
        .prompt([
            {
                name: "selected_role",
                type: "list",
                message: "Which department would you like to delete?",
                choices: role_names,
            }
        ]).then(({ selected_role }) => {
            const index = role_names.findIndex(item => item === selected_role);
            connection.query(
                `DELETE FROM role WHERE id = ?`,
                role_id[index],
                (err) => {
                    if (err) throw err;
                    mainMenu();
                }
            )
        })
};

const deleteDepartment = () => {
    connection.query(
        `SELECT id, name FROM department`, (err, data) => {
            if (err) throw err;
            const dept_id = [];
            const dept_names = [];
            data.forEach(item => {
                dept_id.push(item.id);
                dept_names.push(item.name);
            })
            deleteDepartmentSelect(dept_id, dept_names)
        }
    )
}

const deleteDepartmentSelect = (dept_id, dept_names) => {
    inquirer
        .prompt([
            {
                name: "selected_dept",
                type: "list",
                message: "Which department would you like to delete?",
                choices: dept_names,
            }
        ]).then(({ selected_dept }) => {
            const index = dept_names.findIndex(item => item === selected_dept);
            connection.query(
                `DELETE FROM department WHERE id = ?`,
                dept_id[index],
                (err) => {
                    if (err) throw err;
                    mainMenu();
                }
            )
        })
};