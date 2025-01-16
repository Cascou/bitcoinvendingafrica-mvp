//-----------------------------------------------------------------
// Start of bluRechargeAirtime.js -- responsible for creating the Blu Voucher Airtime Voucher 
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const request = require('postman-request')
const {bluSellKey, bluAuthorization} = require('./constantVariables/variables')
//Initializing Path & Body Variables needed
const bluUrl = 'https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/sales';

//-----------------------------------------------------------------
// createAirtimeVoucher Method Header
const createAirtimeVoucher =  (requestID, vendorId, mobileNumber, amount, callback)=>{

  const airtimeHeader = {
    method: 'POST',
    url: bluUrl,
    headers: {
      'accept': 'application/json',
      'Trade-Vend-Channel': 'API',
      'apikey': bluSellKey, //will hold value of your api key
      'authorization': bluAuthorization,
      'Content-Type':'application/json'
    },
    body: {
      'requestId': requestID,
      'vendorId': vendorId,
      'mobileNumber': mobileNumber,
      'amount': amount
    },
    json: true
  };

  request(airtimeHeader, (error, response) =>{
    if(error){
      callback('Unable to connect to services', undefined);
    }else{
      callback(undefined,  {
        amount: response.body.amount,
        mobileNumber: response.body.mobileNumber,
        transRef: response.body.reference,
        vendor: response.body.vendorName     
      });
    }
  });
}

//-----------------------------------------------------------------
// Exporting createAirtimeVoucher method 
module.exports = createAirtimeVoucher 

//-----------------------------------------------------------------
// End of bluReachargeAirtime.js 
//-----------------------------------------------------------------