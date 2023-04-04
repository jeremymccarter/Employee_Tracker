SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Name,
        role.title AS Title, department.department_name AS Department, role.salary AS Salary, 
        CONCAT(boss.first_name, " ", boss.last_name) AS Manager
        FROM employee JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS boss ON boss.id = employee.manager_id
;

SELECT role.id AS ID, role.title AS Title, role.salary AS Salary, 
        department.department_name AS Department 
        FROM role JOIN department ON role.department_id = department.id
;

SELECT department.id AS ID, department.department_name AS Department 
        FROM department
;