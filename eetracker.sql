DROP DATABASE IF EXISTS ee_tracker;

CREATE DATABASE ee_tracker;

USE ee_tracker;

CREATE TABLE employees (
    ee_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER NOT NULL,
    CONSTRAINT roles_role_id_fk FOREIGN KEY (role_id) 
    REFERENCES roles (role_id),
    manager_id INTEGER
    );
    
CREATE TABLE departments (
    department_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(30)
    );

CREATE TABLE roles (
    role_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(30),
    salary DEC(10,2),
    department_id INTEGER NOT NULL,
    CONSTRAINT departments_department_id_fk FOREIGN KEY (department_id)
    REFERENCES departments (department_id)
    );


--  CRUD
--  Intial table set up, load departments and roles
--  first set up departments since roles table needs info from departments
INSERT INTO departments (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

--  2nd set up roles, including foreign key from departments
INSERT INTO roles ( title, salary, department_id)
    VALUES ('Sales Lead', 100000, 1),
    ('Sales Person', 80000, 1)
    ('Lead Engineer', 150000, 2)
    ('Software Engineer', 120000, 2)
    ('Accountant', 125000, 3)
    ('Legal Team Lead', 250000, 4)
    ('Lawyer', 190000, 4);

INSERT INTO employees ( first_name, last_name, role_id, manager_id)
    VALUES 
        ('Ashley', 'Rodriguez', 3, NULL),
        ('Malia','Brown', 5, NULL),
        ('Sarah', 'Lourd', 6, NULL)

INSERT INTO employees ( first_name, last_name, role_id, manager_id)
    VALUES     
        ('John', 'Doe', 1, 1)

INSERT INTO employees ( first_name, last_name, role_id, manager_id)
    VALUES     
        ('Mike', 'Chan', 2, 4),
        ('Kevin', 'Tupik', 4, 1),
        ('Tom', 'Allen', 7, 3)

        