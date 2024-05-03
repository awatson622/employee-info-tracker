const mysql = require('mysql');
const readline = require('readline');

// Function to create connection pool to MySQL database
function createConnection() {
    return mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'Crash622!', 
        database: 'mysql'
    });
}

// Function to display menu options
function displayMenu() {
    console.log('Options:');
    console.log('1. View all departments');
    console.log('2. View all roles');
    console.log('3. View all employees');
    console.log('4. Add a department');
    console.log('5. Add a role');
    console.log('6. Add an employee');
    console.log('7. Update an employee role');
    console.log('8. Exit');
}

// Function to handle user input
function handleInput(pool, choice) {
    switch (choice) {
        case '1':
            viewDepartments(pool);
            break;
        case '2':
            viewRoles(pool);
            break;
        case '3':
            viewEmployees(pool);
            break;
        case '4':
            addDepartment(pool);
            break;
        case '5':
            addRole(pool);
            break;
        case '6':
            addEmployee(pool);
            break;
        case '7':
            updateEmployeeRole(pool);
            break;
        case '8':
            pool.end();
            process.exit();
        default:
            console.log('Invalid option. Please choose again.');
            break;
    }
}

// Function to view all departments
function viewDepartments(pool) {
    pool.query('SELECT * FROM departments', (error, results) => {
        if (error) throw error;
        console.log('Departments:');
        results.forEach(department => {
            console.log(`ID: ${department.department_id}, Name: ${department.department_name}`);
        });
        displayMenu();
    });
}

// Function to view all roles
function viewRoles(pool) {
    pool.query('SELECT roles.title, roles.salary, departments.department_name FROM roles INNER JOIN departments ON roles.department_id = departments.department_id', (error, results) => {
        if (error) throw error;
        console.log('Roles:');
        results.forEach(role => {
            console.log(`Title: ${role.title}, Salary: ${role.salary}, Department: ${role.department_name}`);
        });
        displayMenu();
    });
}

// Function to view all employees
function viewEmployees(pool) {
    pool.query('SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id LEFT JOIN employees AS manager ON employees.manager_id = manager.employee_id', (error, results) => {
        if (error) throw error;
        console.log('Employees:');
        results.forEach(employee => {
            console.log(`ID: ${employee.employee_id}, Name: ${employee.first_name} ${employee.last_name}, Title: ${employee.title}, Department: ${employee.department_name}, Salary: ${employee.salary}, Manager: ${employee.manager}`);
        });
        displayMenu();
    });
}

// Function to add a department
function addDepartment(pool) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the name of the department: ', (name) => {
        pool.query('INSERT INTO departments (department_name) VALUES (?)', [name], (error, results) => {
            if (error) throw error;
            console.log('Department added successfully.');
            rl.close();
            displayMenu();
        });
    });
}

// Function to add a role
async function addRole(pool) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Prompt for title
    const title = await new Promise((resolve) => {
        rl.question('Enter the title of the role: ', (answer) => {
            if (answer.trim() === '') {
                console.log('Invalid input. Title cannot be empty.');
                rl.close();
                displayMenu();
            } else {
                resolve(answer);
            }
        });
    });

    // Prompt for salary
    const salary = await new Promise((resolve) => {
        rl.question('Enter the salary for the role: ', (answer) => {
            resolve(answer);
        });
    });

    // Prompt for department ID
    const departmentId = await new Promise((resolve) => {
        rl.question('Enter the department ID for the role: ', (answer) => {
            resolve(answer);
        });
    });

    // Insert role into database
    pool.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId], (error, results) => {
        if (error) throw error;
        console.log('Role added successfully.');
        rl.close();
        displayMenu();
    });
}


// Function to add an employee
function addEmployee(pool, rl) {
    rl.question('Enter the first name of the employee: ', (firstName) => {
        rl.question('Enter the last name of the employee: ', (lastName) => {
            rl.question('Enter the role ID for the employee: ', (roleId) => {
                rl.question('Enter the manager ID for the employee (or leave blank if none): ', (managerId) => {
                    pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId || null], (error, results) => {
                        if (error) throw error;
                        console.log('Employee added successfully.');
                        displayMenu();
                        rl.prompt();
                    });
                });
            });
        });
    });
}


// Function to update an employee role
function updateEmployeeRole(pool) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the ID of the employee you want to update: ', (employeeId) => {
        rl.question('Enter the new role ID for the employee: ', (newRoleId) => {
            pool.query('UPDATE employees SET role_id = ? WHERE employee_id = ?', [newRoleId, employeeId], (error, results) => {
                if (error) throw error;
                console.log('Employee role updated successfully.');
                rl.close();
                displayMenu();
            });
        });
    });
}

// Main function to start the application
function startApp() {
    const pool = createConnection();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('close', () => {
        console.log('Exiting application.');
        process.exit(0);
    });

    console.log('Welcome to the Employee Management System.');
    displayMenu();

    // Handling user input
    rl.on('line', (input) => {
        rl.prompt();

        // If the user is adding an employee, call the addEmployee function with the readline interface
        if (input === '6') {
            addEmployee(pool, rl);
        } else {
            handleInput(pool, input.trim());
        }
    });
}

// Start the application
startApp();