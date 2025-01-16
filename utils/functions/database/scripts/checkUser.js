//-----------------------------------------------------------------
// Start of checkUser.js -- Script that counts the number of records in the database where phone numbers match
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
// Initializing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// checkUser Callback method, with user phone number as parameter
const checkUser = (number, callback)=>{

    var connection = new Connection(config); //creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();
      
    function executeStatement() {  
        var request = new Request('select count(1) phoneNumber from customer where phoneNumber = '+ number + ';', 
        function(err) {  
            if (err) {  
                console.log(err);}  
            });  

            var result = "";
            
            //gets value of UserID
            request.on('row', function(columns) {  
                columns.forEach(function(column) {  
                  if (column.value === null) {  
                    console.log('NULL');  
                  } else {  
                    result+= column.value;  
                  }  
                });  
                callback(undefined,{
                    result: result
                }) 
                result ="";  
            });   
        
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Checking User."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting checkUser Method
module.exports = checkUser;

//-----------------------------------------------------------------
// End of checkUser.js
//-----------------------------------------------------------------
