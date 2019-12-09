//create a wrapper class for the MySQL client 
// from https://codeburst.io/node-js-mysql-and-promises-4c3be599909b 
//

//The constructor simply creates a new MySQL connection with the given configuration. 
//Note that it doesn’t open the connection yet. 
//The connection is automatically opened when the first query is executed. 
//That’s why creating the connection is not an asynchronous operation.
//
//Note that the query() method still returns immediately, before the query is executed. 
//In order to get the results, we have to call the then() method of the returned promise and specify a function that will be called when the query finishes executing.

const mysql = require( 'mysql' );
class Database {

    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}