//-----------------------------------------------------------------
// Start of insertWalletBeneficiary.js -- Script that inserts wallet beneficiary details into Azure Database
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertUser Callback Function
function insertWalletBeneficiary( myUserID, beneficiaryName, walletAddress, currency, hash, timeCreated){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request("INSERT INTO WalletBeneficiary(myUserID, beneficiaryName, walletAddress, currency, beneficiaryHash, TimeCreated) VALUES (@UserID, @Name, @Address, @currency, @hash, '" + timeCreated + "');", 
        function(err, results) {  
            if (err) throw err;  
            else console.log("Inserted " + results + " row into WalletBeneficiary")
        });
        request.addParameter('UserID', TYPES.Int, myUserID);
        request.addParameter('Name', TYPES.VarChar, beneficiaryName);
        request.addParameter('Address', TYPES.VarChar, walletAddress);    
        request.addParameter('currency', TYPES.VarChar, currency);  
        request.addParameter('hash', TYPES.VarChar, hash);
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Inserting Wallet Beneficiary."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting insertWalletBeneficiary Method
module.exports = insertWalletBeneficiary

//-----------------------------------------------------------------
// End of insertWalletBeneficiary.js
//-----------------------------------------------------------------