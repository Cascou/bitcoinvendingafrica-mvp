//-----------------------------------------------------------------
// Start of updateMobileBeneficiary.js -- Script that updates mobile beneficiary
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// updateMobileBeneficiary Callback Function
function updateMobileBeneficiary(beneficiaryHash, beneficiaryName, mobileAddress, currency, newHash, TimeCreated){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request("UPDATE MobileBeneficiary SET beneficiaryName = @beneficiaryName, mobileAddress = @mobileAddress, currency = @currency, beneficiaryHash = @newHash, timeCreated = '" + TimeCreated + "' where beneficiaryHash = @beneficiaryHash;", 
        function(err, result) {  
            if (err) throw err
            else console.log('Updated ' + result + ' row in Beneficiary')
        });
        request.addParameter('beneficiaryName', TYPES.VarChar, beneficiaryName);
        request.addParameter('mobileAddress', TYPES.VarChar, mobileAddress); 
        request.addParameter('currency', TYPES.VarChar, currency); 
        request.addParameter('beneficiaryHash', TYPES.VarChar, beneficiaryHash);  
        request.addParameter('newHash', TYPES.VarChar, newHash);  

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Updating Mobile Beneficiary"); 
        });

        connection.execSql(request);
    }  
}

//-----------------------------------------------------------------
// Exporting updateMobileBeneficiary Method
module.exports = updateMobileBeneficiary

//-----------------------------------------------------------------
// End of updateMobileBeneficiary.js
//-----------------------------------------------------------------