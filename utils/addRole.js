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
    console.log(`addRole Connected to the companyrecords_db`)
);

const newRole = [
    {
        name: "title",
        message: "What is the name of the new role?",
        type: "input"
    },
    {
        name: "salary",
        message: "What is the salary of the new role?",
        type: "input"
    },
    {
        name: "depart",
        message: "What department does the role belong to?",
        choices: [],
        type: "list"
    }
];

function addRole() {
    db.query(`SELECT department.department_name FROM department`, (err, results) => {
        if (err) throw err;
        let deptArray = []
        for (i = 0; i < results.length; i++) {
            deptArray.push(results[i].department_name)
        } newRole[2].choices = deptArray;
    })

    inquirer
        .prompt(newRole)
        .then(input => {
            const trackEmployees = require("../server");

            db.query(`SELECT * FROM department WHERE department_name="${input.depart}"`, function (err, res) {
                let depart = res[0].id

                db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${input.title}", 
                "${input.salary}", "${depart}")`, function (err, res) {
                    console.log(`"${input.title}" has been added as a new Role.`)
                    trackEmployees();
                })
            })
        })
}

module.exports = addRole;