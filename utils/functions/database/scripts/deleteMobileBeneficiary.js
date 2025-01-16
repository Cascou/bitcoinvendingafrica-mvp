//-----------------------------------------------------------------
// Start of deleteMobileBeneficiary.js -- Script that deletes mobileBeneficiaries
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request  
  
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// deleteWalletBeneficiary Callback Function
function deleteMobileBeneficiary(userID, beneficiaryID){

    var connection = new Connection(config);  

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });
    
    connection.connect();
      
    function executeStatement() {  
        var request = new Request("DELETE FROM MobileBeneficiary WHERE myUserID = " + userID + " AND beneficiaryID = " + beneficiaryID + ";", 
        function(err, results) {  
            if (err) throw err  
            else console.log("Deleted " + results + " row from MobileBeneficiary") 
        });   
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done deleting MobileBeneficiary."); 
        });

        connection.execSql(request);
    }  
}

//-----------------------------------------------------------------
// Exporting deleteMobileBeneficiary Method
module.exports = deleteMobileBeneficiary

//-----------------------------------------------------------------
// End of deleteMobileBeneficiary.js
//-----------------------------------------------------------------