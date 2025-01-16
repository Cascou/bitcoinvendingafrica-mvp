//-----------------------------------------------------------------
// Start of insertMobileBeneficiary.js -- Script that inserts mobile beneficiary details into Azure Database
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// insertMobileBeneficiary Callback Function
function insertMobileBeneficiary( myUserID, beneficiaryName, mobileNumber, currency, beneficiaryHash, TimeCreated){

    var connection = new Connection(config);//creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();

    function executeStatement() {  
        var request = new Request("INSERT INTO MobileBeneficiary(myUserID, beneficiaryName, mobileAddress, currency, beneficiaryHash, TimeCreated) VALUES (@UserID, @Name, @Number, @currency, @Hash, '" + TimeCreated + "');", 
        function(err, results) {  
            if (err) throw err;  
            else console.log("Inserted " + results + " row into MobileBeneficiary")
        });
        request.addParameter('UserID', TYPES.Int, myUserID);
        request.addParameter('Name', TYPES.VarChar, beneficiaryName);
        request.addParameter('Number', TYPES.VarChar, mobileNumber);    
        request.addParameter('currency', TYPES.VarChar, currency);  
        request.addParameter('Hash', TYPES.VarChar, beneficiaryHash);  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Inserting Mobile Beneficiary."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting insertMobileBeneficiary Method
module.exports = insertMobileBeneficiary

//-----------------------------------------------------------------
// End of insertMobileBeneficiary.js
//-----------------------------------------------------------------