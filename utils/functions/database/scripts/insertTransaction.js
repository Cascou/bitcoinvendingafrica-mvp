//-----------------------------------------------------------------
// Start of insertTransaction.js -- Script that inserts transaction details into Azure Database 'transactions'
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertTransaction Callback Function
function insertTransaction( userID, phoneNumber, transactionID, jsonObject, originalAmount, tradedAmount, amountFee, orderSide, currency, currencyPrice, valrFee, btcBalance, usdtBalance, timeCreated){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request("INSERT INTO Transactions (myUserID, phoneNumber, transactionID, jsonObject, originalAmount, tradedAmount, amountFee, orderSide, currency, currencyPrice, valrFee, btcBalance, usdtBalance, TimeCreated) VALUES (" + userID + "," + phoneNumber + ", @transactionID, @jsonObject," + originalAmount + "," + tradedAmount + "," + amountFee + ", @orderSide, @currency," + currencyPrice + "," + valrFee + "," + btcBalance + "," + usdtBalance + ",'" + timeCreated +"');",
        function(err, results) {  
            if (err) throw err;  
            else console.log("Inserted " + results + " row into Transaction")
        });
        request.addParameter('transactionID', TYPES.VarChar, transactionID); 
        request.addParameter('jsonObject', TYPES.VarChar, jsonObject); 
        request.addParameter('orderSide', TYPES.VarChar, orderSide); 
        request.addParameter('currency', TYPES.VarChar, currency);    
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Inserting Transaction."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting insertTransaction Method
module.exports = insertTransaction

//-----------------------------------------------------------------
// End of insertTransaction.js
//-----------------------------------------------------------------