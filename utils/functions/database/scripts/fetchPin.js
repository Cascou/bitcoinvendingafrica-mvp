//-----------------------------------------------------------------
// Start of fetchPin.js -- Script that fetches pin of associated number
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// fetchPin Callback Function with phone number as a parameter
const fetchPin = (number, callback)=>{

    var connection = new Connection(config); //creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();
      
    function executeStatement() {  
        var request = new Request('SELECT userPin FROM dbo.Customer where phoneNumber = ' + number + ';', 
        function(err) {  
            if (err) {  
                console.log(err);}  
            });  

            var result = "";
            
            //gets value of UserPin
            request.on('row', function(columns) {  
                columns.forEach(function(column) {  
                  if (column.value === null) {  
                    console.log('NULL');  
                  } else {  
                    result+= column.value;  
                  }  
                });  
                callback(undefined,{
                    pin: result
                }) 
                result ="";  
            });   
        
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
            console.log("Done Fetching Pin."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting fetchPin Method
module.exports = fetchPin

//-----------------------------------------------------------------
// End of fetchPin.js
//-----------------------------------------------------------------