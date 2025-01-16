//-----------------------------------------------------------------
// Start of validateUser.js -- Script that gets the pin associated with that phone number
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const fs = require('fs');
var mysql = require('mysql');
// Initialzing all libraries necessary
const config = require('../dbConnection/connection');

//-----------------------------------------------------------------
// validateUser Callback Method, user phone number as a parameter
const validateUser = (number, callback)=>{
    
    const conn = new mysql.createConnection(config);
    
    conn.connect(
        function (err) { 
        if (err) { 
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }else{
           console.log("Connection established.");
        }
    });
    
    conn.query('SELECT userPin FROM customer where phoneNumber = ' + number + ';', 
    function (err, results, fields) {
        if (err) throw err;
        else{
            callback(undefined, {
                pin: results[0].userPin
            });
        }
    });
    
    conn.end(function (err) { 
        if (err) throw err;
        else{
            console.log('Done getting user pin.');
        }    
    });
} 

//-----------------------------------------------------------------
// Exporting the validateUser Method
module.exports = validateUser;

//-----------------------------------------------------------------
// End of validateUser.js
//-----------------------------------------------------------------