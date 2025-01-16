//-----------------------------------------------------------------
// Start of marketHistory.js -- responsible for for getting transaction details from VALR API
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const request = require('postman-request')
const crypto = require('crypto')
// Initializing all libraries necessary
const requestSignature = require('../functions/code/signature');
const {myApi, mySecret} = require('./constantVariables/variables');
const verb = 'GET'

//-----------------------------------------------------------------
// marketHistory Method
const marketHistory =  (ID, callback)=>{

    const path = '/v1/orders/history/detail/orderid/' + ID
    const timestamp = Math.floor(Date.now())
    const signature = requestSignature(mySecret, timestamp, verb, path, body ='')//no need for body

    //-----------------------------------------------------------------
    //creating the object that will be passed through the request
    const marketHeader = {
        method: 'GET',
        url: 'https://api.valr.com/v1/orders/history/detail/orderid/' + ID,
        headers:{
            'X-VALR-API-KEY': myApi,
            'X-VALR-SIGNATURE': signature,
            'X-VALR-TIMESTAMP': timestamp,
        },
        json: true
    }

    request(marketHeader, (error, response) =>{
        if(error){
            callback('Unable to connect to VALR services!', undefined)
        }else if(response.error){
            callback('Unable to view balance', undefined)
        }else{
            callback(undefined, {
                //data needed for buy/sell options and consumer data
                orderId: response.body[0].orderId,
                currencyPair: response.body[0].currencyPair,
                orderSide: response.body[0].orderSide,
                originalPrice: response.body[0].originalPrice,
                originalQuantity: response.body[0].originalQuantity,
                currencyPrice: response.body[0].executedPrice,
                valrFee: response.body[0].executedFee,
                balance: response.body[0].executedQuantity,
                //rest of the data for full json object
                jsonResponse: response
            });
        }
    });
}

//-----------------------------------------------------------------
// Exporting marketHistory method 
module.exports = marketHistory

//-----------------------------------------------------------------
// End of marketHistory.js 
//-----------------------------------------------------------------