//-----------------------------------------------------------------
// Start of createVoucher.js -- Script that creates a voucher instance and inserts into Azure Database 'CreateVoucher'
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request  
  
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertUser Callback Function
function createVoucher(userID, creationDate){

    var connection = new Connection(config);  

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });
    
    connection.connect();
      
    function executeStatement() {  
        var request = new Request('INSERT INTO CreatedVoucher (myUserID, CreationDate) VALUES (' + userID + ',' + creationDate +');', 
        function(err, results) {  
            if (err) throw err  
            else console.log("Inserted " + results + " row into CreatedVoucher") 
        });   
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Creating Voucher."); 
        });

        connection.execSql(request);
    }  
}

//-----------------------------------------------------------------
// Exporting createVoucher Method
module.exports = createVoucher

//-----------------------------------------------------------------
// End of createVoucher.js
//-----------------------------------------------------------------