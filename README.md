# employee-management-system

Command line application content management system for managing a company's employees using node, inquirer, and MySQL.

## Interface

Start application:

    ```
    node server.js

    ```
Features:

  * View All Employee Data

  * View Employees by Department

  * View Employees by Manager

  * Add departments, roles, employees

  * View departments, roles, employees

  * Delete departments, roles, and employees

  * Update employees, departments, roles

## Database

![Database Schema](Assets/schema.png)

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager
  

## Packages


* Uses the [MySQL](https://www.npmjs.com/package/mysql) NPM package connect to database and perform queries

* Uses [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.

* Uses [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console.

Refer to package.json for dependencies


## Directory

* config
  - connection.js : connect to mysql database
  - orm.js        : define promise based methods for querying database

* db
  - schema.sql    : define database and tables ![Database Schema](Assets/schema.png)
  - seeds.sql     : starter data for employees, departments, and roles

* server.js       : command line application



