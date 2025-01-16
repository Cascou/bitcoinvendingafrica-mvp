//-----------------------------------------------------------------
// Start of fetchSpecficWalletBeneficiary.js -- Script that fetches the selected beneficiary
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const sql = require('mssql');
// Initialzing all libraries necessary
const {config} = require('../dbConnection/connection');

//-----------------------------------------------------------------
// fetchSpecficWalletBeneficiary Callback Function with phone number as a parameter
const fetchSpecficWalletBeneficiary = (beneficiaryHash, userID, callback)=>{

    sql.connect(config, err=>{
        new sql.Request().query("SELECT beneficiaryName, walletAddress, currency from WalletBeneficiary where beneficiaryHash = '" + beneficiaryHash + "' AND myUserID = " + userID + ";", (error, result)=>{
            sql.close()
            callback(undefined,{
                data: result.recordset
            })
        })
    });
}


//-----------------------------------------------------------------
// Exports fetchSpecficWalletBeneficiary Method
module.exports = fetchSpecficWalletBeneficiary;

//-----------------------------------------------------------------
// End of fetchSpecificWalletBeneficiary.js
//-----------------------------------------------------------------