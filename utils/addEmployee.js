// Require mysql to use it as a database, inquirer so a user can interact with that database.
const mysql = require("mysql2");
const inquirer = require("inquirer");

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
    console.log(`addEmployee connected to the companyrecords_db`)
);

// This is the object I pass into inquirer
const newEmployee = [
    {
        name: "firstname",
        message: "What is the new employees first name?",
        type: "input"
    },
    {
        name: "lastname",
        message: "What is the new employees last name?",
        type: "input"
    },
    {
        name: "title",
        message: "What will be the new employees role?",
        choices: [],
        type: "list"
    },
    {
        name: "manager",
        message: "Who will be the new employees manager?",
        choices: [],
        type: "list"
    }
];

// This is the function that is called upon. It creates a new employee. 
function addEmployee() {
    // Here I am querying a list of roles from the database to use as choices for my 3rd question. 
    db.query(`SELECT title FROM role`, (err, results) => {
        if (err) throw err;
        let roleArray = []
        for (i = 0; i < results.length; i++) {
            roleArray.push(results[i].title)
        } newEmployee[2].choices = roleArray;
    })
    // Here I am querying a list of managers from the database to use as choices for my 4th question. 
    db.query(`SELECT CONCAT(first_name, " ", last_name) AS managers FROM employee WHERE manager_id IS NULL`, (err, results) => {
        if (err) throw err;
        let managerArray = []
        for (i = 0; i < results.length; i++) {
            managerArray.push(results[i].managers)
        } newEmployee[3].choices = managerArray;
    })
    // Inquirer runs the object through the prompt, then I use that input to insert a new employee into the correct table. 
    inquirer
        .prompt(newEmployee)
        .then(input => {
            const trackEmployees = require("../server");
            // Querying a database and table to find the id of the role selected. 
            db.query(`SELECT * FROM role WHERE title="${input.title}"`, function (err, res) {
                let role = res[0].id
                // Querying a database and a table to find the id of the manager selected. 
                db.query(`SELECT * FROM employee WHERE CONCAT(first_name, " ", last_name)="${input.manager}"`, function (err, res) {
                    let manager = res[0].id
                    // Querying to insert all the data values into the correct table. 
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
                    ("${input.firstname}", "${input.lastname}", "${role}", "${manager}")`, function (err, res) {
                        console.log(`"${input.firstname}" has been added as a new employee.`)
                        trackEmployees();
                    })
                })
            })
        })
};

module.exports = addEmployee;
