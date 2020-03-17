USE employees_DB;

INSERT INTO departments (department)
VALUES ("HR"), ("Engineering"), ("Quality"), ("Sales"), ("Legal"), ("HSE\&F");

INSERT INTO roles (title, salary, department_id)
VALUES ("HR Generalist", 55000.00, 1), 
("Software Developer", 130000.99, 2), ("Software Engineering Manager", 155098.50, 2), 
("QA Specialist", 78000.00, 3), ("QA Manager", 90100.00, 3), 
("Marketing Lead", 42000.00, 4), ("Business Analyst", 33000.00, 4), ("Sales Director", 200000.00, 4), 
("Financial Analyst", 89000, 5), ("Legal Consultant", 169888.00, 5),
("HSE Engineer", 80000.00, 6), ("HSE Site Lead", 150000.00, 6);

INSERT INTO employees (first_name, last_name, role_id) VALUES ("Bob", "Scott", 2);

INSERT INTO employees (first_name, last_name, role_id) VALUES ("Big", "Boss", 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Tom", "Sawyer", 2, 2);