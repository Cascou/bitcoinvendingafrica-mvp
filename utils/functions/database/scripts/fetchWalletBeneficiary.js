//-----------------------------------------------------------------
// Start of fetchWalletBeneficiary.js -- Script that fetches wallet beneficiary Table
//-----------------------------------------------------------------


//-----------------------------------------------------------------
// Initializing all npm packages necessary
const sql = require('mssql');
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// fetchPin Callback Function with phone number as a parameter
const fetchWalletBeneficiary = (userID, callback)=>{

    sql.connect(config, err=>{
        new sql.Request().query('SELECT * FROM dbo.WalletBeneficiary where myUserID = '+ userID +';', (error, result)=>{
            sql.close()
            callback(undefined,{
                data: result.recordset
            });
        });   
    });
}

//-------------------------------------------------------------------------
//Exporting fetchWalletBeneficiary Method
module.exports = fetchWalletBeneficiary

//-------------------------------------------------------------------------
//End of fetchWalletBeneficiary.js
//-------------------------------------------------------------------------
