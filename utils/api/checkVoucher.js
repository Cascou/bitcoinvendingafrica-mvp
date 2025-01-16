//-----------------------------------------------------------------
// Start of checkVoucher.js -- responsible for checking the status of the BluLabel Voucher 
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const request = require('postman-request')
const {bluKey, bluAuthorization} = require('./constantVariables/variables')

//-----------------------------------------------------------------
// voucherStatus Method Header
const voucherStatus =  ( voucherDetail, callback)=>{
  
  const voucherHeader = {
    method: 'GET',
    url: 'https://api.live.bltelecoms.net/v2/trade/voucher/variable/vouchers?token=' + voucherDetail,
    headers: {
      'Content-Type': 'application/json',
      'Trade-Vend-Channel': 'API',
      'apikey': bluKey, //will hold value of your api key
      'authorization': bluAuthorization
    },
    body: {
        'token:': voucherDetail
    },
    json: true
  };

  request(voucherHeader, (error, response) =>{
    if(error){
      callback('Unable to connect to services', undefined);
    }else{
      callback(undefined,  {
        status: response.body.status,
        amount: response.body.amount,
        redemptionRequestId: response.body.redemptionRequestId          
      });
    }
  });
}

//-----------------------------------------------------------------
// Exporting voucherStatus method 
module.exports = voucherStatus 

//-----------------------------------------------------------------
// End of checkVoucher.js 
//-----------------------------------------------------------------
