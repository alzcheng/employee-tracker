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
    inquirer.prompt({
        name: "department_name",
        type: "input",
        message: "Please enter the new department name."
    }).then((userResponse) => {
        connection.query(
            "INSERT INTO department (name) VALUE (?)", userResponse.department_name, (err, data) => {
                if (err) throw err;
                mainMenu();
            }
        )
    })
}