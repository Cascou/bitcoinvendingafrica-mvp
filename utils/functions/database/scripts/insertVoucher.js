//-----------------------------------------------------------------
// Start of insertVoucher.js -- Script that inserts created voucher details into Azure Database 'CreatedVoucher'
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertVoucher Callback Function
function insertVoucher( myUserID, RequestHash, ProductID, Amount, VoucherPin, RequestID, ConsumerAccountNumber){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request('UPDATE CreatedVoucher SET RequestHash = @RequestHash, ProductId = ' + ProductID + ', Amount = ' + Amount + ', VoucherPin = @VoucherPin, ConsumerAccountNumber = ' + ConsumerAccountNumber + ' WHERE myUserID = ' + myUserID + ' AND RequestID = ' + RequestID + ';', 
        function(err, results) {  
            if (err) throw err;  
            else console.log("Inserted " + results + " row into Transaction")
        });
        request.addParameter('VoucherPin', TYPES.VarChar, VoucherPin);    
        request.addParameter('RequestHash', TYPES.VarChar, RequestHash);  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Inserting Created Voucher."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting insertVoucher Method
module.exports = insertVoucher

//-----------------------------------------------------------------
// End of insertVoucher.js
//-----------------------------------------------------------------