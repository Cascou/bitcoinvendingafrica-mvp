//-----------------------------------------------------------------
// Start of fetchMobileBeneficiary.js -- Script that fetches mobile beneficiary Table
//-----------------------------------------------------------------


//-----------------------------------------------------------------
// Initializing all npm packages necessary
const sql = require('mssql');
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// fetchPin Callback Function with phone number as a parameter
const fetchMobileBeneficiary = (userID, callback)=>{

    sql.connect(config, err=>{
        new sql.Request().query('SELECT * FROM dbo.MobileBeneficiary where myUserID = '+ userID +';', (error, result)=>{
            sql.close()
            callback(undefined,{
                data: result.recordset
            });
        });  
    });
}

//-------------------------------------------------------------------------
// Exporting fetchMobileBeneficiary Method
module.exports = fetchMobileBeneficiary

//-------------------------------------------------------------------------
//End of fetchMobileBeneficiary.js
//-------------------------------------------------------------------------