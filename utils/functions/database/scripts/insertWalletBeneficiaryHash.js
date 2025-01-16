//-----------------------------------------------------------------
// Start of insertWalletBeneficiaryHash.js -- Script that inserts hash into Azure Database 'WalletBeneficiary'
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
  
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertWalletBeneficiaryHash Callback Function
function insertWalletBeneficiaryHash(beneficiaryID, beneficiaryHash){

    var connection = new Connection(config);  

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });
    
    connection.connect();
      
    function executeStatement() {  
        var request = new Request('UPDATE WalletBeneficiary SET beneficiaryHash = @beneficiaryHash WHERE beneficiaryID = @beneficiaryID;', 
        function(err, results) {  
            if (err) throw err;  
            else console.log("Inserted " + results + " row into WalletBeneficiary")
        });
        request.addParameter('beneficiaryHash', TYPES.VarChar, beneficiaryHash);
        request.addParameter('beneficiaryID', TYPES.Int, beneficiaryID);   
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Updating Wallet Beneficiary."); 
        });

        connection.execSql(request);
    }  
}

//-----------------------------------------------------------------
// Exporting insertWalletBeneficiaryHash Method
module.exports = insertWalletBeneficiaryHash

//-----------------------------------------------------------------
// End of insertWalletBeneficiaryHash.js
//-----------------------------------------------------------------