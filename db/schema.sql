-- Removing & creating a new database to start with a clean slate.
DROP DATABASE IF EXISTS companyrecords_db;
CREATE DATABASE companyrecords_db;

-- Selecting the database to write data too. 
USE companyrecords_db;

-- Verifying the database we are in. 
SELECT DATABASE();

-- Creating the departments table. 
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

-- Creating the roles table.
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL, 
    -- This links the department_id to the department table by the id. 
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Creating the employees table. 
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL, 
    -- This links the role_id to the role table by the id. 
    FOREIGN KEY (role_id) REFERENCES role(id),
    manager_id INT,
    -- This links the manager_id to this employee table to reference the manager. 
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);