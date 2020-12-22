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
            name: "department_id",
            type: "input",
            message: "What is the department id of the role?"
        },
    ]).then(({ title, salary, department_id }) => {
        connection.query(
            "INSERT INTO role (title, salary, department_id) VALUE (?,?,?)", [title, salary, department_id], (err, data) => {
                if (err) throw err;
                mainMenu();
            }
        )
    })
}

const addEmployee = () => {
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
            name: "role_id",
            type: "input",
            message: "What is role ID of the employee?"
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is manager ID of the employee?"
        },
    ]).then(({ first_name, last_name, role_id, manager_id }) => {
        if (manager_id === "") {
            connection.query(
                "INSERT INTO employee (first_name, last_name, role_id) VALUE (?,?,?)", [first_name, last_name, role_id], (err) => {
                    if (err) throw err;
                    mainMenu();
                }
            )
        } else {
            connection.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?,?,?,?)", [first_name, last_name, role_id, manager_id], (err) => {
                    if (err) throw err;
                    mainMenu();
                }
            )
        }

    })
}

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