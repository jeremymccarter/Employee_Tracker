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
    console.log(`roleUpdate connected to the companyrecords_db`)
);
// This is the object I pass into inqurier. 
const roleChange = [
    {
        name: "employee",
        message: "Which employee's role would you like to update?",
        choices: [],
        type: "list"
    },
    {
        name: "role",
        message: "Which role do you want to assign to the selected employee?",
        choices: [],
        type: "list"
    }
]

// Here I am querying an array of employees for the choices in my inquirer. 
db.query(`SELECT CONCAT(first_name, " ", last_name) AS fullname FROM employee`, (err, results) => {
    if (err) throw err;
    let employeeArray = []
    for (i = 0; i < results.length; i++) {
        employeeArray.push(results[i].fullname)
    } roleChange[0].choices = employeeArray;
})
// Here I am querying an array of roles for the choices in inquirer. 
db.query(`SELECT title AS role FROM role`, (err, results) => {
    if (err) throw err;
    let roleArrary = []
    for (i = 0; i < results.length; i++) {
        roleArrary.push(results[i].role)
    } roleChange[1].choices = roleArrary;
})
// This is the function that updates the roles. 
function roleUpdate() {

    inquirer
        .prompt(roleChange)
        .then(input => {
            const trackEmployees = require("../server");
            let nameSplit = input.employee;
            let split = nameSplit.split(" ");
            let name = split[0];

            db.query(`SELECT * FROM role WHERE title="${input.role}"`, function (err, res) {
                let role = res[0].id

                db.query(`UPDATE employee SET role_id="${role}" WHERE first_name="${name}"`, function (err, res) {
                    console.log("Updated role for " + input.employee + ".");
                    trackEmployees();
                    // })
                })
            })
        })
};

module.exports = roleUpdate;