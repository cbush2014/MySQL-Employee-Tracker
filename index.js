const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
// const asciiArt = require('ascii-art');
// const asciiArtFont = require('ascii-art-font');
const Department = require('./departments.js');
const Roles = require('./roles.js');
const Employee = require('./employees.js');


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "ee_tracker"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    //    start program here
    mainMenu();
});

let displayMsg = true;
const asciiArt2 = `
,ggggggg,                                                                                       
,dP""""""Y8b                                ,dPYb,                                                
d8'    a  Y8                                IP''Yb                                                
88     "Y8P'                                I8  8I                                                
'8baaaa                                     I8  8'                                                
,d8P""""       ,ggg,,ggg,,ggg,   gg,gggg,    I8 dP    ,ggggg,    gg     gg   ,ggg,    ,ggg,        
d8"           ,8" "8P" "8P" "8,  I8P"  "Yb   I8dP    dP"  "Y8ggg I8     8I  i8" "8i  i8" "8i       
Y8,           I8   8I   8I   8I  I8'    ,8i  I8P    i8'    ,8I   I8,   ,8I  I8, ,8I  I8, ,8I       
'Yba,,_____, ,dP   8I   8I   Yb,,I8 _  ,d8' ,d8b,_ ,d8,   ,d8'  ,d8b, ,d8I  'YbadP'  'YbadP'       
'"Y8888888 8P'   8I   8I   'Y8PI8 YY88888P8P'"Y88P"Y8888P"    P""Y88P"888888P"Y888888P"Y888      
                              I8                                   ,d8I'                        
                              I8                                 ,dP'8I                         
                              I8                                ,8"  8I                         
                              I8                                I8   8I                         
                              I8                                '8, ,8I                         
                              I8                                 'Y8P"                          
,ggg, ,ggg,_,ggg,                                                                                 
dP""Y8dP""Y88P""Y8b                                                                                
Yb, '88'  '88'  '88                                                                                
'"  88    88    88                                                                                
  88    88    88                                                                                
  88    88    88    ,gggg,gg   ,ggg,,ggg,     ,gggg,gg    ,gggg,gg   ,ggg,    ,gggggg,          
  88    88    88   dP"  "Y8I  ,8" "8P" "8,   dP"  "Y8I   dP"  "Y8I  i8" "8i   dP""""8I          
  88    88    88  i8'    ,8I  I8   8I   8I  i8'    ,8I  i8'    ,8I  I8, ,8I  ,8'    8I          
  88    88    Y8,,d8,   ,d8b,,dP   8I   Yb,,d8,   ,d8b,,d8,   ,d8I  'YbadP' ,dP     Y8,         
  88    88    'Y8P"Y8888P"'Y88P'   8I   'Y8P"Y8888P"'Y8P"Y8888P"888888P"Y8888P      'Y8         
                                                              ,d8I'                             
                                                            ,dP'8I                              
                                                           ,8"  8I                              
                                                           I8   8I                              
                                                           '8, ,8I                              
                                                            'Y8P"                               
`;

const asciiArt = `
EEEEEEE                     lll                                
EE      mm mm mmmm  pp pp   lll  oooo  yy   yy   eee    eee    
EEEEE   mmm  mm  mm ppp  pp lll oo  oo yy   yy ee   e ee   e   
EE      mmm  mm  mm pppppp  lll oo  oo  yyyyyy eeeee  eeeee    
EEEEEEE mmm  mm  mm pp      lll  oooo       yy  eeeee  eeeee   
                    pp                  yyyyy                  
MM    MM                                                       
MMM  MMM   aa aa nn nnn    aa aa  gggggg   eee  rr rr          
MM MM MM  aa aaa nnn  nn  aa aaa gg   gg ee   e rrr  r         
MM    MM aa  aaa nn   nn aa  aaa ggggggg eeeee  rr             
MM    MM  aaa aa nn   nn  aaa aa      gg  eeeee rr             
                                  ggggg           
`;

const mainMenu = () => {

//    asciiArt text -F <font> "Employee Manager";

//    asciiArtFont.create("Employee Manager", 'Doom'), function(rendered) {};
    if (displayMsg) {
        console.log(asciiArt2);
        displayMsg = false;
    }

    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                'Add Department', 'Add Role', 'Add Employee',
                'View All Employees',
                'View ALL EE by Dept',
                'View ALL EE by Mgr',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Exit'
            ]
        })
        .then((answer) => {
            // perform function based on their answer
            switch (answer.action) {
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'View All Employees':
                    viewAllEE();
                    break;
                case 'View ALL EE by Dept':
                    viewEEbyDept();
                    break;
                case 'View ALL EE by Mgr':
                    queryEEbyMGR();
                    break;
                case 'Remove Employee':
                    removeEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'Update Employee Manager':
                    updateManager();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Exit':
                    console.log('Exiting...');
                    connection.end();
                    process.exit();
                    break;
                default:
                    console.log('Exiting...');
                    connection.end();
                    process.exit();
            }

        });
}

const updateRole = () => {
    // display list of employees in an inquirer prompt so user can select employee to delete, then run delete query
    connection.query('SELECT * FROM employees', (err, employees) => {
        if (err) throw err;

        connection.query(`SELECT * FROM roles ORDER BY title`, function (err, roles) {
            if (err) throw err;  

        inquirer.prompt([
            {
                type: "list",
                name: "ee_id",   // make this the same as field name so we can use in DELETE statement below
                message: "Which employee's role would you like to update?",
                choices: function () {
                    // NOTE: rows comes back in a format that inquirer won't understand, so use map to tranform
                    return employees.map(ee => {
                        return { name: `${ee.first_name} ${ee.last_name}`, value: ee.ee_id, short: `${ee.first_name} ${ee.last_name}` };
                    })
                }
            },
            {
                type: "list",
                name: "newRole",   // make this the same as field name so we can use in DELETE statement below
                message: "Select new role for this employee",
                choices: function () {
                    // NOTE: rows comes back in a format that inquirer won't understand, so use map to tranform
                    return roles.map(role => {
                        return { name: role.title, value: role.role_id, short: role.title };
                    })
                }                
            }
        ]).then(answers => {
           // console.log(answers);
            const qry = connection.query("UPDATE employees SET ? WHERE ?",
                [
                    { role_id: answers.newRole },
                    { ee_id: answers.ee_id }
                ], (err, result) => {
                    if (err) throw err;
                    //console.log(result.affectedRows + ' records updated.');
                    //console.log(qry.sql);
                });
                // HERE is code after successful UPDATE of db
                // call main menu function
                mainMenu();

        });

    });
})
//crbtemp    mainMenu();

}


const updateManager = () => {
    // display list of employees in an inquirer prompt so user can select employee to delete, then run delete query
    connection.query('SELECT * FROM employees', (err, employees) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "ee_id",   // make this the same as field name so we can use in DELETE statement below
                message: "Which employee's manager would you like to update?",
                choices: function () {
                    // NOTE: rows comes back in a format that inquirer won't understand, so use map to tranform
                    return employees.map(ee => {
                        return { name: `${ee.first_name} ${ee.last_name}`, value: ee.ee_id, short: `${ee.first_name} ${ee.last_name}` };
                    })
                }
            },
            {
                type: "list",
                name: "newMgr",   // make this the same as field name so we can use in DELETE statement below
                message: "Which employee do you want to set as manager for the selected employee?",
                choices: function () {
                    // NOTE: rows comes back in a format that inquirer won't understand, so use map to tranform
                    return employees.map(ee => {
                        return { name: `${ee.first_name} ${ee.last_name}`, value: ee.ee_id, short: `${ee.first_name} ${ee.last_name}` };
                    })
                }                
            }
        ]).then(answers => {
           // console.log(answers);
            const qry = connection.query("UPDATE employees SET ? WHERE ?",
                [
                    { manager_id: answers.newMgr },
                    { ee_id: answers.ee_id }
                ], (err, result) => {
                    if (err) throw err;
                   // console.log(result.affectedRows + ' records updated.');
                   // console.log(qry.sql);
                });
                // HERE is code after successful UPDATE of db
                // call main menu function
                mainMenu();

        });

    });
//crbtemp    mainMenu();

}


const removeEmployee = () => {
    // display list of employees in an inquirer prompt so user can select employee to delete, then run delete query
    connection.query('SELECT * FROM employees', (err, employees) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "ee_id",   // make this the same as field name so we can use in DELETE statement below
                message: "Which employee would you like to remove?",
                choices: function () {
                    // NOTE: rows comes back in a format that inquirer won't understand, so use map to tranform
                    return employees.map(ee => {
                        return { name: `${ee.first_name} ${ee.last_name}`, value: ee.ee_id, short: `${ee.first_name} ${ee.last_name}` };
                    })
                }
            }
        ]).then(answers => {
            // remove employee, we may need to adjust this if we delete a manager to fix orphans
            //console.log(answers);
            connection.query("DELETE FROM employees WHERE ?", [answers], (err, result) => {
                if (err) throw err;
              //  console.log(result.affectedRows + ' records deleted.')

                // IF this was a manager, you will need to set all their direct reports to have manager id to NULL
                // or you can for now put in validation to prevent managers from being deleted here
                const crb = connection.query("UPDATE employees SET ? WHERE ?",
                    [
                        { manager_id: 0 },
                        { manager_id: answers.ee_id }
                    ], (err, result) => {
                        if (err) throw err;
                        //console.log(result.affectedRows + ' records updated.');
                        // console.log(crb.sql);
                    });

            })
                // HERE is code after successful UPDATE of db
                // call main menu function
                mainMenu();

        });

    });
//crbtemp    mainMenu();
}


const addDepartment = () => {

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Department name?"
        }
    ]).then(answers => {
        //console.log(answers);
        connection.query('INSERT INTO departments (name) VALUES (?)', [answers.name], (err, data) => {
            if (err) throw err;
          //  console.log(`Added ${answers.name} to departments.`);
            mainMenu();
        });
    });
};


const addRole = () => {
    // NOTE: need to put query here Outside call to inquirer.prompt because it is Async
    connection.query("SELECT * FROM departments", (err, rows) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Title?"
            },
            {
                type: "input",
                name: "salary",
                message: "Salary?"
            },
            {
                type: "list",
                name: "department",
                message: "Department?",
                choices: function () {
                    // NOTE: rows comes back in a format that inquirer won't understand, so use map to tranform
                    return rows.map(row => {
                        return { name: row.name, value: row.department_id, short: row.name };
                    })
                }
            }
        ]).then(answers => {
           // console.log(`Adding role...${answers.department}`);
            connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',
                [answers.title, answers.salary, answers.department], (err, data) => {
                    if (err) throw err;
                    mainMenu();
                });
        });
    });
};

function viewAllEE() {

    const strSQL =
        `SELECT e.ee_id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(mgr.first_name, " ", mgr.last_name) AS manager  
        FROM employees AS e
        LEFT JOIN roles as r ON e.role_id = r.role_id 
        LEFT JOIN employees as mgr ON e.manager_id = mgr.ee_id 
        LEFT JOIN departments as d ON d.department_id = r.department_id`

    //console.log(strSQL);

    connection.query(strSQL, function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

function queryEEbyMGR() {

    const strSQL = `SELECT e.ee_id, e.first_name, e.last_name, r.title, d.name, r.salary, concat(mgr.first_name, " ", mgr.last_name) as "manager name"  
    FROM employees AS e
    LEFT JOIN roles as r ON e.role_id = r.role_id 
    INNER JOIN employees as mgr ON e.manager_id = mgr.ee_id 
    LEFT JOIN departments as d ON d.department_id = r.department_id  
    ORDER BY mgr.last_name ASC;`
   // console.log(strSQL);

    connection.query(strSQL, function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

function viewEEbyDept() {

    const strSQL = `SELECT e.ee_id, e.first_name, e.last_name, r.title, d.name, r.salary, mgr.first_name, mgr.last_name 
        FROM employees AS e
        LEFT JOIN roles as r ON e.role_id = r.role_id 
        LEFT JOIN employees as mgr ON e.manager_id = mgr.ee_id 
        LEFT JOIN departments as d ON d.department_id = r.department_id  
        ORDER BY d.name ASC`;
   // console.log(strSQL);

    connection.query(strSQL, function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

function viewAllRoles() {
    connection.query("SELECT * FROM ee_tracker.roles;", function (err, rows) {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
};


function addEmployee() {

    connection.query(`SELECT * FROM ee_tracker.roles ORDER BY title`, function (err, roles) {
        if (err) throw err;

        connection.query(`
            SELECT mgr.first_name, mgr.last_name, mgr.ee_id  
            FROM employees AS e
            LEFT JOIN roles as r ON e.role_id = r.role_id 
            INNER JOIN employees as mgr ON e.manager_id = mgr.ee_id 
            LEFT JOIN departments as d ON d.department_id = r.department_id  
            ORDER BY mgr.last_name ASC `
            , function (err, mgr) {
                if (err) throw err;
                // move inquirer prompt inside here after 2 queries fire to get choice information
                //
                inquirer
                    .prompt([
                        {
                            name: "firstName",
                            type: "input",
                            message: "What is the employee's first name?"
                        },
                        {
                            name: "lastName",
                            type: "input",
                            message: "What is the employee's last name?"
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "What is the employee's role?",
                            choices: function () {
                                // NOTE: rows comes back in a format that inquirer won't understand, so use map to tranform
                                return roles.map(role => {
                                    return { name: role.title, value: role.role_id, short: role.title };
                                })
                            }
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Who is the employee's manager?",
                            choices: function () {
                                // NOTE: rows comes back in a format that inquirer won't understand, so use map to tranform
                                return mgr.map(m => {
                                    return { name: `${m.first_name} ${m.last_name}`, value: m.ee_id, short: `${m.first_name} ${m.last_name}` };
                                })
                            }
                        }

                    ])
                    .then(answers => {
                        //console.log(answers);

                       // console.log(`Adding employee...${answers.firstname} ${answers.lastname}`);
                        connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
                            [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, data) => {
                                if (err) throw err;
                                mainMenu();
                            });
                    });

            });
    });
}


