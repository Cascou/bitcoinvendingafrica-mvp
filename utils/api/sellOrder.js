//-----------------------------------------------------------------
// Start of sellOrder.js -- responsible for selling a specific currency with  VALR marketOrder 
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const request = require('postman-request')
const crypto = require('crypto')

//-------------------------------------------------------------------------
// Initializing all libraries necessary
const requestSignature = require('../functions/code/signature');
const {myApi, mySecret, pathMarketOrder, post, btcPair, usdtPair } = require('./constantVariables/variables');


//-----------------------------------------------------------------
// Order Method
const sellOrder =  (amount, phoneNumber, side, currency, callback)=>{
  
  let myPair = '';

  if(currency === 'BTC'){
    myPair = btcPair;
  }else{
    myPair = usdtPair;
  }

  const body ={
    side: side,
    baseAmount: amount,//has to match the amount you actually want to sell, in order to be the authentic signature
    pair: myPair,
    customerOrderId: phoneNumber
  }
  
  const timestamp = Math.floor(Date.now())
  const myBody = JSON.stringify(body)//need to stringify object created above.
  const signature = requestSignature(mySecret, timestamp, post, pathMarketOrder, myBody)//make variable signature to be assigned to the result of the signRequest Method

  const orderHeader = {
    method: 'POST',
    url: 'https://api.valr.com/v1/orders/market',
    headers: {//headers depicted by VALR Docs
      'Content-Type': 'application/json',
      'X-VALR-API-KEY': myApi,//will hold value of your api key
      'X-VALR-SIGNATURE': signature,//will hold the result of your signature, with all parameters passed through method
      'X-VALR-TIMESTAMP': timestamp//holds timestamp value
    },
    body: {
      side: side,
      baseAmount: amount,//has to match the amount you actually want to sell, in order to be the authentic signature
      pair: myPair,
      customerOrderId: phoneNumber
    },
    json: true
    };

    request(orderHeader, (error, response) =>{
      if(error){
        callback('Unable to connect to services', undefined);
      } else{
        callback(undefined,  {
          result: response
        });
      }
    });
  }

//-----------------------------------------------------------------
// Exporting sellOrder method 
module.exports = sellOrder 

//-----------------------------------------------------------------
// End of sellOrder.js 
//-----------------------------------------------------------------
