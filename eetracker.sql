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
