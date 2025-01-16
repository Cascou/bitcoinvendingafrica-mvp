//-----------------------------------------------------------------
// Start of insertRedemption.js -- Script that inserts redemption voucher into Azure Database 'redemptions'
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertRedemption Callback Function
function insertRedemption(userID, voucherDetail, amount, requestID, timeCreated){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request("INSERT INTO Redemptions (myUserID, voucherPIN, amount, requestID, TimeCreated) VALUES (" + userID + "," + voucherDetail + "," + amount + ", @requestID, '" + timeCreated + "');", 
        function(err, result) {  
            if (err) throw err
            else console.log('Inserted ' + result + ' row in Redemption')
        });
        request.addParameter('requestID', TYPES.VarChar, requestID); 

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Inserting Redemption."); 
        });

        connection.execSql(request);
    }  
}

//-----------------------------------------------------------------
// Exporting insertRedemption Method
module.exports = insertRedemption

//-----------------------------------------------------------------
// End of insertRedemption.js
//-----------------------------------------------------------------