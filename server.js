// Require mysql to use it as a database, inquirer so a user can interact with that database.
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const addDepartment = require("./utils/addDepartment");
const addEmployee = require("./utils/addEmployee");
const addRole = require("./utils/addRole");
const roleUpdate = require("./utils/roleUpdate")

// Connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        // MySQL username,
        user: "root",
        // MySQL Password, if using
        password: "root",
        database: "companyrecords_db"
    },
    console.log(`server.js connected to the companyrecords_db`)
);

db.connect(function (err) {
    if (err) throw err;
    console.log("connected to db")
    //trackEmployees()
})

// Arry of choices for our application. 
const mainMenu = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "mainMenu",
        choices: ["View All Employees", "Add Employee", "Update Employee Role",
            "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }
]

// Use inquirer to launch a Command Line Application with the following options.
function trackEmployees() {
    inquirer
        .prompt(mainMenu)
        .then(function (user) {
           // console.log(user)
            switch (user.mainMenu) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Update Employee Role":
                    roleUpdate();
                    break;

                case "View All Roles":
                    viewAllRoles();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "View All Departments":
                    viewAllDepartments();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Quit":
                    quit();
                    break;


            }
        })
};

// This function, when called upon, displays a table with all of the employees & data. 
function viewAllEmployees() {
    db.query(`SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee,
            role.title AS Title, department.department_name AS Department, role.salary AS Salary, 
            CONCAT(boss.first_name, " ", boss.last_name) AS Manager
            FROM employee JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee AS boss ON boss.id = employee.manager_id`, function (err, results) {
        console.table(results);
        trackEmployees();
    })
};

// This function, when called upon, displays a table with all of the roles & data. 
function viewAllRoles() {
    db.query(`SELECT role.id AS ID, role.title AS Title, role.salary AS Salary, 
            department.department_name AS Department 
            FROM role JOIN department ON role.department_id = department.id`, function (err, results) {
        console.table(results);
        trackEmployees();
    })
};

// This function, when chosen, will show us all the departments. 
function viewAllDepartments() {
    db.query(`SELECT department.id AS ID, department.department_name AS Department 
            FROM department`, function (err, results) {
        console.table(results);
        trackEmployees();
    })
};

// This function will quit the application. 
function quit() {
    console.log("Goodbye");
    process.exit();
};

// Here is where we call the starting function once the application opens. 
trackEmployees();

module.exports = trackEmployees;