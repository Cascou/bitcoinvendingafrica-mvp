//-----------------------------------------------------------------
// Start of fetchMobileBeneficiaryID.js -- Script that fetches beneficiaryID
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// fetchMobileBeneficiaryID Method Header
const fetchMobileBeneficiaryID = (userID, beneficiaryMobile, callback)=>{
    var connection = new Connection(config); //creates connection

    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connection Opened.");  
        executeStatement();  
    });

    connection.connect();
      
    function executeStatement() {  
        var request = new Request('SELECT beneficiaryID FROM MobileBeneficiary where myUserID = ' + userID + ' AND mobileAddress = ' + beneficiaryMobile + ';', 
        function(err) {  
            if (err) {  
                console.log(err);}  
            });  

            var result = "";
            
            //gets value of UserID
            request.on('row', function(columns) {  
                columns.forEach(function(column) {  
                  if (column.value === null) {  
                    console.log('NULL');  
                  } else {  
                    result+= column.value;  
                  }  
                });  
                callback(undefined,{
                    ID: result
                }) 
                result ="";  
            });   
        
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function () {
            connection.close();
            console.log("Done Fetching mobile beneficiaryID."); 
        });

        connection.execSql(request);
    } 
}

//-----------------------------------------------------------------
// Exporting fetchMobileBeneficiaryID Method
module.exports = fetchMobileBeneficiaryID

//-----------------------------------------------------------------
// End of fetchMobileBeneficiaryID.js
//-----------------------------------------------------------------