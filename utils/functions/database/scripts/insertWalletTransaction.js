//-----------------------------------------------------------------
// Start of insertWalletTransaction.js -- Script that inserts wallet transaction details into Azure Database
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertWalletTransaction Callback Function
function insertWalletTransaction( myUserID, walletAddress, currency, amount, fee, timeCreated){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request("INSERT INTO PendingWithdrawals(myUserID, RecipientAddress, Currency, Amount, Fee, TimeCreated) VALUES (@UserID, @Address, @Currency,"+ amount + ", " + fee + ", '" + timeCreated + "');", 
        function(err, results) {  
            if (err) throw err;  
            else console.log("Inserted " + results + " row into PendingWithdrawal")
        });
        request.addParameter('UserID', TYPES.Int, myUserID);
        request.addParameter('Address', TYPES.VarChar, walletAddress);
        request.addParameter('Currency', TYPES.VarChar, currency);    
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Inserting Pending Withdrawal."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting insertWalletTransaction Method
module.exports = insertWalletTransaction

//-----------------------------------------------------------------
// End of insertWalletTransaction.js
//-----------------------------------------------------------------