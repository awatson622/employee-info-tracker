ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';

UPDATE employee SET manager_id = <new_manager_id> WHERE id = <employee_id>;

SELECT e.*, m.first_name AS manager_first_name, m.last_name AS manager_last_name
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id
WHERE e.manager_id = <manager_id>;

SELECT e.*, r.title AS role_title
FROM employee e
INNER JOIN role r ON e.role_id = r.id
WHERE r.department_id = <department_id>;

DELETE FROM department WHERE id = <department_id>;

DELETE FROM role WHERE id = <role_id>;

DELETE FROM employee WHERE id = <employee_id>;

SELECT SUM(r.salary) AS total_budget
FROM employee e
INNER JOIN role r ON e.role_id = r.id
WHERE r.department_id = <department_id>;
