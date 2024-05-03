-- Populate the department table
INSERT INTO department (name) VALUES
('Sales'),
('Marketing'),
('Engineering');

-- Populate the role table
INSERT INTO role (title, salary, department_id) VALUES
('Sales Manager', 60000, 1),
('Sales Representative', 40000, 1),
('Marketing Manager', 55000, 2),
('Marketing Coordinator', 38000, 2),
('Software Engineer', 80000, 3),
('QA Engineer', 70000, 3);

-- Populate the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, 4),
('Jane', 'Smith', 2, 1),
('Alex', 'Johnson', 3, 1),
('Emily', 'Davis', 4, 3);

