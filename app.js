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
            "Add departments, roles, or employees",
            "View departments, roles, or employees",
            "Update employee roles",
            "Exit program",
        ],
    }).then((userResponse) => {
        console.log(userResponse.action);
        switch (userResponse.action) {
            case "Add departments, roles, or employees":
                addToDB();
                break;
            case "View departments, roles, or employees":
                viewDB();
                break;
            case "Update employee roles":

                break;

            default:
                connection.end();
                process.exit(0);
                break;
        }
    })
};

// -------------------- Adding to the Database --------------------------
const addToDB = () => {
    inquirer.prompt({
        name: "added_element",
        type: "list",
        message: "Which element do you like to add to the database?",
        choices: [
            "Department",
            "Role",
            "Employee"
        ],
    }).then((userResponse) => {
        switch (userResponse.added_element) {
            case "Department":
                addDepartment();
                break;

            case "Role":
                addRole();
                break;

            default:
                addEmployee();
                break;
        }
    })
};

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
const viewDB = () => {
    inquirer.prompt({
        name: "view_table",
        type: "list",
        message: "Which table would you like to view in the database?",
        choices: [
            "Department",
            "Role",
            "Employee"
        ],
    }).then((userResponse) => {
        switch (userResponse.view_table) {
            case "Department":
                viewDepartment();
                break;

            case "Role":
                viewRole();
                break;

            default:
                viewEmployee();
                break;
        }
    })
};

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
        "SELECT * FROM role", (err, data) => {
            if (err) throw err;
            console.table(data);
            mainMenu();
        }
    )
}

const viewEmployee = () => {
    connection.query(
        "SELECT * FROM employee", (err, data) => {
            if (err) throw err;
            console.table(data);
            mainMenu();
        }
    )
}