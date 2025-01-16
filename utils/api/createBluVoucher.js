//-----------------------------------------------------------------
// Start of createBluVoucher.js -- responsible for creating the Blu Voucher 
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const request = require('postman-request')
const {bluSellKey, bluAuthorization} = require('./constantVariables/variables')
const moment = require('moment-timezone');
const crypto = require('crypto');
//-------------------------------------------------------------------------
//Initializing Path & Body Variables needed
const bluUrl = 'https://api.live.bltelecoms.net/v2/trade/voucher/variable/sales';

//-----------------------------------------------------------------
// createBluVoucher Method Header
const createBluVoucher =  ( requestID, transactionRequestDateTime, phoneNumber, amount,  callback)=>{

  const voucherHeader = {
    method: 'POST',
    url: bluUrl,
    headers: {
      'accept': 'application/json',
      'apikey': bluSellKey, //will hold value of your api key
      'authorization': bluAuthorization,
      'Content-Type':'application/json'
    },
    body: {
      'requestId': requestID,
      'productId': '7',
      'amount': amount,
      'vendMetaData':{
        'transactionRequestDateTime': transactionRequestDateTime,
        'consumerAccountNumber': phoneNumber
      }
    },
    json: true
  };

  request(voucherHeader, (error, response) =>{
    if(error){
      callback('Unable to connect to services', undefined);
    }else{
      callback(undefined,  {
        token: response.body.token,
        amount: response.body.amount,
        serial: response.body.serialNumber,
        transRef: response.body.reference,
        instruction: response.body.productInstructions,
        response: response
      });
    }
  });
}

//-----------------------------------------------------------------
// Exporting createBluVoucher method 
module.exports = createBluVoucher 

//-----------------------------------------------------------------
// End of createBluVoucher.js 
//-----------------------------------------------------------------
