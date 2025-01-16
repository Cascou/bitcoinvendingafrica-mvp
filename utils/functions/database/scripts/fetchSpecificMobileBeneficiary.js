//-----------------------------------------------------------------
// Start of fetchSpecficMobileBeneficiary.js -- Script that fetches the selected beneficiary
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const sql = require('mssql');
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// fetchSpecficMobileBeneficiary Callback Function with phone number as a parameter
const fetchSpecficMobileBeneficiary = (beneficiaryHash, userID, callback)=>{

    sql.connect(config, err=>{
        new sql.Request().query("SELECT beneficiaryName, mobileAddress, currency from MobileBeneficiary where beneficiaryHash = '" + beneficiaryHash + "' AND myUserID = " + userID + ";", (error, result)=>{
            sql.close()
            callback(undefined,{
                data: result.recordset
            })
        })
    });
}


//-----------------------------------------------------------------
// Exports fetchSpecficMobileBeneficiary Method
module.exports = fetchSpecficMobileBeneficiary;

//-----------------------------------------------------------------
// End of fetchSpecificMobileBeneficiary.js
//-----------------------------------------------------------------