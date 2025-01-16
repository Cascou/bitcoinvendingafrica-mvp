//-----------------------------------------------------------------
// Start of updateUser.js -- Script that updates user
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');
const {encrypt} = require('../../code/hashPin');

//-----------------------------------------------------------------
// updateUser Callback Function
function updateUser(myUserID, userPin){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request("UPDATE Customer SET userPin = @userPin where userID = @myUserID;", 
        function(err, result) {  
            if (err) throw err
            else console.log('Updated ' + result + ' row in Beneficiary')
        });
        request.addParameter('myUserID', TYPES.Int, myUserID);
        request.addParameter('userPin', TYPES.VarChar, userPin); 
  

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Updating User"); 
        });

        connection.execSql(request);
    }  
}

//-----------------------------------------------------------------
// Exporting updateUser Method
module.exports = updateUser

//-----------------------------------------------------------------
// End of updateUser.js
//-----------------------------------------------------------------