//-----------------------------------------------------------------
// Start of marketOrder.js -- responsible for checking the status of the BluLabel Voucher 
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const request = require('postman-request');
const {bluKey, bluAuthorization} = require('./constantVariables/variables');

//Initializing Path & Body Variables needed
const bluUrl = 'https://api.live.bltelecoms.net/v2/trade/voucher/variable/redemptions';

//-----------------------------------------------------------------
// voucherStatus Method Header, taking in Serial Number/Voucher Pin as the parameter
const redeemVoucher =  ( requestID, voucherDetail, amount,  callback)=>{
   
  const redeemHeader = {
    method: 'POST',
    url: bluUrl,
    headers: {
      'accept': 'application/json',
      'Trade-Vend-Channel': 'API',
      'apikey': bluKey, //will hold value of your api key
      'authorization': bluAuthorization,
      'Content-Type':'application/json'
    },
    body: {
        'requestId': requestID,
        'token': voucherDetail,
        'amount':amount
    },
    json: true
  };

  request(redeemHeader, (error, response) =>{
    if(error){
      callback('Unable to connect to services', undefined);
    }else{
      callback(undefined,  {
        body: response.body
    });
    }
  });
}

//-----------------------------------------------------------------
// Exporting redeemVoucher method 
module.exports = redeemVoucher 

//-----------------------------------------------------------------
// End of redeemVoucher.js 
//-----------------------------------------------------------------