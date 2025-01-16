//-----------------------------------------------------------------
// Start of fetchRequestID.js -- Script that fetches requestID of associated number
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// fetchRequestID Callback Function with phone number as a parameter
const fetchRequestID = (userID, creationDate, callback)=>{

    var connection = new Connection(config); //creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();
      
    function executeStatement() {  
        var request = new Request('SELECT RequestID FROM CreatedVoucher where myUserID = ' + userID + ' and CreationDate = ' + creationDate+ ';', 
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
                    requestID: result
                }) 
                result ="";  
            });   
        
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Fetching RequestID."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting fetchRequestID Method
module.exports = fetchRequestID

//-----------------------------------------------------------------
// End of fetchRequestID.js
//-----------------------------------------------------------------