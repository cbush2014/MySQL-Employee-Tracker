class Employee {
    constructor(ee_id, first_name, last_name, role_id, manager_id) {
        this.ee_id = ee_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    } 
}

module.exports = Employee;
