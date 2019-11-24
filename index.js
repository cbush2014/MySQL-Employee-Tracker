const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

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
    // run the start function after the connection is made to prompt the user
    start();
});

function queryAllEmployees() {
    connection.query('SELECT * FROM ee_tracker.employees', function (err, res) {
        if (err) throw err;
        console.log(res.length);
    });

}


const createItem = (answersPost) => {
    console.log("creating item...")
    var query = connection.query(
        "INSERT INTO bid_items SET ?",
        {
            item: answersPost.postName,
            category: answersPost.postCag,
            open_bid: answersPost.startingBid

        },
        (err, res) => {
            if (err) throw err;
            console.log(res.affectedRows + " item inserted!\n");
        }
    );
}

const updateItem = (answersBid) => {
    console.log("Updating item information...")
    var query = connection.query("UPDATE bid_items SET ? WHERE ?",
        [
            {
                item: answersBid.Bid
            },
            {
                current_bid: answersBid.BidPrice
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " items updated")
        });
    console.log(query.sql);
}


// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "postOBid",
            type: "list",
            message: "What would you like to do?",
            choices: [
                'View All Employees',
                'View ALL EE by Dept',
                'View ALL EE by Mgr',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Exit'
            ]
        })
        .then(function (answer) {
            // perform function based on their answer
            switch (answer.postOBid) {
                case 'View All Employees':
                    runQuery();
                    break;

                case 'View ALL EE by Dept':
                    queryEEbyDEPT();
                    break;

                case 'View ALL EE by Mgr':
                    queryEEbyMGR();
                    break;

                case 'Add Employee':
                    break;

                case 'Remove Employee':
                    break;

                case 'Update Employee Role':
                    break;
                case 'Update Employee Manager':
                    break;
                case 'View All Roles':
                    queryAllRoles();
                    break;
                case 'Exit':
                    connection.end();
                    break;
                default:
            }
            start();
        });
}

function runQuery() {

    const strSQL = "SELECT e.ee_id, e.first_name, e.last_name, r.title, d.name, r.salary, mgr.first_name, mgr.last_name " +
        "FROM employees AS e " +
        "LEFT JOIN roles as r ON e.role_id = r.role_id " +
        "LEFT JOIN employees as mgr ON e.manager_id = mgr.ee_id " +
        "LEFT JOIN departments as d ON d.department_id = r.department_id ORDER BY r.salary DESC";
    console.log(strSQL);

    connection.query(strSQL, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
};

function queryEEbyMGR() {

    const strSQL = `SELECT e.ee_id, e.first_name, e.last_name, r.title, d.name, r.salary, mgr.first_name, mgr.last_name 
    FROM employees AS e
    LEFT JOIN roles as r ON e.role_id = r.role_id 
    INNER JOIN employees as mgr ON e.manager_id = mgr.ee_id 
    LEFT JOIN departments as d ON d.department_id = r.department_id  
    ORDER BY mgr.last_name ASC`;
    console.log(strSQL);

    connection.query(strSQL, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
};

function queryEEbyDEPT() {

    const strSQL = `SELECT e.ee_id, e.first_name, e.last_name, r.title, d.name, r.salary, mgr.first_name, mgr.last_name 
        FROM employees AS e
        LEFT JOIN roles as r ON e.role_id = r.role_id 
        LEFT JOIN employees as mgr ON e.manager_id = mgr.ee_id 
        LEFT JOIN departments as d ON d.department_id = r.department_id  
        ORDER BY d.name ASC`;
    console.log(strSQL);

    connection.query(strSQL, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
};

function queryAllRoles() {

    connection.query("SELECT * FROM ee_tracker.roles;", function (err, res) {
        if (err) throw err;
        console.table(res);
    });
};

// function to handle posting new items up for auction
function postAuction() {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the item you would like to submit?"
            },
            {
                name: "category",
                type: "input",
                message: "What category would you like to place your auction in?"
            },
            {
                name: "startingBid",
                type: "input",
                message: "What would you like your starting bid to be?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO auctions SET ?",
                {
                    item_name: answer.item,
                    category: answer.category,
                    starting_bid: answer.startingBid || 0,
                    highest_bid: answer.startingBid || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your auction was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });
}
