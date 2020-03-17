DROP DATABASE IF EXISTS employees_DB;

CREATE DATABASE employees_DB;

USE employees_DB;

CREATE TABLE departments (
id int NOT NULL AUTO_INCREMENT,
department varchar(30) NOT NULL UNIQUE,
PRIMARY KEY (id)
);

CREATE TABLE roles (
id int NOT NULL AUTO_INCREMENT,
title varchar(30) NOT NULL UNIQUE,
salary decimal,
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES departments(id) ON UPDATE CASCADE
);

CREATE TABLE employees (
id int NOT NULL AUTO_INCREMENT,
first_name varchar(30) NOT NULL,
last_name varchar(30) NOT NULL,
role_id int NOT NULL,
manager_id int,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id)  ON UPDATE CASCADE
);

