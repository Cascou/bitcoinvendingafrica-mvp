//-----------------------------------------------------------------
// Start of checkBalance.js -- Script that sums the balance of user in the database
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
// Initializing all libraries necessary
const {config} = require('../dbConnection/connection');


//-----------------------------------------------------------------
// balanceQuery Method Header, takes in number as a parameter
const balanceQuery = (number, callback)=>{

    var connection = new Connection(config); //creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();
      
    function executeStatement() {  
        var request = new Request('SELECT SUM(btcBalance) as BTC, SUM(usdtBalance) as USDT from transactions where phoneNumber = ' + number + ';', 
        function(err) {  
            if (err) {  
                console.log(err);}  
            });  

            var result = "";
            
            //gets value of UserID
            request.on('row', function(columns) {  
                columns.forEach(function(column) {  
                  if (column.value === null) {  
                    result += column.value + " "  
                  } else {  
                    result += column.value + " "
                  }  
                });

                let arr = result.split(' ');
                
                callback(undefined,{
                    phoneNumber: number,
                    btc: arr[0],
                    usdt: arr[1]
                }) 
                result ="";  
            });   
        
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Checking Balance."); 
        });

        connection.execSql(request);
    } 
}


//-----------------------------------------------------------------
// Exports balanceQuery Method
module.exports = balanceQuery;

//-----------------------------------------------------------------
// End of checkBalance.js
//-----------------------------------------------------------------
