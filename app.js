const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update employee roles",
            "Exit program",
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
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update employee roles":
                updateEmployeeRoles();
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
        console.table(data);
        mainMenu();
    }
    )
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
            for (let i = 0; i < data.length; i++) {
                dept_id.push(data[i].id);
                dept_names.push(data[i].name);
            }
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
            for (let i = 0; i < data.length; i++) {
                role_id.push(data[i].id);
                role_titles.push(data[i].title);
            }
            connection.query(
                'SELECT id, CONCAT(first_name, " ", last_name) "mgr_name" FROM employee',
                (err, data) => {
                    if (err) throw err;
                    //Need to insert case for NULL
                    const mgr_id = [];
                    const mgr_names = [];
                    for (let i = 0; i < data.length; i++) {
                        mgr_id.push(data[i].id);
                        mgr_names.push(data[i].mgr_name);
                    }
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

const updateEmployee = () => {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the first name of the employee you are trying to update?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the last name of the employee you are trying to update?"
        },
        {
            name: "update_type",
            type: "choices",
            message: "What would you like to update?",
            choices: [
                "Employee's role",
                "Employee's manager"
            ]
        },

    ]).then(({ first_name, last_name, update_type }) => {
        // if (update_type === "Employee's role") {
        //     updateEmployeeRole();
        // } else{
        //     updateEmployeeManager(); 
        // }

        // connection.query(
        //     "UPDATE employee SET role_id = ?, manager_id = ? WHERE first_name = ? AND last_name = ?",
        //     [role_id, manager_id, first_name, last_name],
        //     (err) => {
        //         if (err) throw err;
        //         mainMenu();
        //     }
        // )
    })
}

const updateEmployeeRole = () => {

}
// const showRole = (role_id) => {
//     connection.query(
//         ""
//     )
// }