//-----------------------------------------------------------------
// Start of insertUser.js -- Script that inserts user into Azure Database 'customer'
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request  
  
// Initialzing all libraries necessary
const {encrypt} = require('../../code/hashPin');
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertUser Callback Function
function insertUser(phoneNumber, pinNumber, timeCreated){

    var connection = new Connection(config);  

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });
    
    connection.connect();
      
    function executeStatement() {  
        var request = new Request("INSERT INTO customer (phoneNumber, userPin, timeCreated) VALUES ('" + phoneNumber + "','" + pinNumber + "', '" + timeCreated + "');", 
        function(err, results) {  
            if (err) throw err  
            else console.log("Inserted " + results + " row into Customer") 
        });   
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Inserting User."); 
        });

        connection.execSql(request);
    }  
}

//-----------------------------------------------------------------
// Exporting insertUser Method
module.exports = insertUser

//-----------------------------------------------------------------
// End of insertUser.js
//-----------------------------------------------------------------