//----------------------------------------------------------------------------
// Start of variables.js -- Responsible for holding constant variables needed in other files
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------
//Literal variables for signature
const myApi = process.env.my_Api;
const mySecret = process.env.my_Secret;
const get = 'GET';
const post = 'POST';
//For Twilio
const serviceID = process.env.service_ID;
const accountSID = process.env.account_SID;
const authToken = process.env.auth_Token;
//For BluLabel -  BUY
const bluKey = process.env.blu_Key;
const bluAuthorization = process.env.blu_Authorization;
const bluSellKey = process.env.bluSellKey;

//-----------------------------------------------------------------------------
//Literal variables for database
const azureServer = process.env.AZURE_SQL_SERVER;
const userName = process.env.AZURE_SQL_USERNAME;
const password = process.env.AZURE_SQL_PASSWORD;
const database = process.env.AZURE_SQL_DATABASE;

//-------------------------------------------------------------------------
//paths for different API's
const pathOverallBalance = '/v1/account/balances';
const pathMarketOrder = '/v1/orders/market';

//------------------------------------------------------------------------
//currency pairs
const btcPair = 'BTCZAR';
const usdtPair = 'USDTZAR';

//------------------------------------------------------------------------
//Wallet Minimums and fees
const btcMinWithdrawal = process.env.btcMin;
const btcFee = process.env.btcFee;
const usdtMinWithdrawal = process.env.usdtMin;
const usdtFee = process.env.usdtFee;

//-------------------------------------------------------------------------
//paths for different API's
const jwtSecret = process.env.jwt_Secret;

//-------------------------------------------------------------------------
// Exporting all variables
module.exports = {myApi, mySecret, get, post, pathOverallBalance, pathMarketOrder, btcPair, usdtPair, 
    serviceID, accountSID, authToken, jwtSecret, bluKey, bluAuthorization, bluSellKey,
    azureServer, userName, password, database, btcMinWithdrawal, btcFee, usdtMinWithdrawal, usdtFee};

//-------------------------------------------------------------------------
// End of variables.js
//-------------------------------------------------------------------------