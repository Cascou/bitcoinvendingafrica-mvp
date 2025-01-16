//-----------------------------------------------------------------
// Start of updateWalletBeneficiary.js -- Script that updates wallet beneficiary
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// updateWalletBeneficiary Callback Function
function updateWalletBeneficiary(beneficiaryHash, beneficiaryName, walletAddress, currency, newHash, timeCreated){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request("UPDATE WalletBeneficiary SET beneficiaryName = @beneficiaryName, walletAddress = @walletAddress, currency = @currency, beneficiaryHash = @newHash, TimeCreated = '" + timeCreated + "' where beneficiaryHash = @beneficiaryHash;", 
        function(err, result) {  
            if (err) throw err
            else console.log('Updated ' + result + ' row in Beneficiary')
        });
        request.addParameter('beneficiaryName', TYPES.VarChar, beneficiaryName);
        request.addParameter('walletAddress', TYPES.VarChar, walletAddress); 
        request.addParameter('currency', TYPES.VarChar, currency); 
        request.addParameter('beneficiaryHash', TYPES.VarChar, beneficiaryHash);
        request.addParameter('newHash', TYPES.VarChar, newHash)  

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Updating Wallet Beneficiary"); 
        });

        connection.execSql(request);
    }  
}

//-----------------------------------------------------------------
// Exporting updateWalletBeneficiary Method
module.exports = updateWalletBeneficiary

//-----------------------------------------------------------------
// End of updateWalletBeneficiary.js
//-----------------------------------------------------------------