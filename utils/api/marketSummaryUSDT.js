//-----------------------------------------------------------------
// Start of marketSummaryUSDT.js -- responsible for for getting market details from VALR API
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const request = require('postman-request')

//-----------------------------------------------------------------
// marketSummaryUSDT Method
const marketSummaryUSDT =  (callback)=>{
   
    //-----------------------------------------------------------------
    //creating the object that will be passed through the request
    const marketHeader = {
        method: 'GET',
        url: 'https://api.valr.com/v1/public/USDTZAR/marketsummary',
        json: true
    }

    request(marketHeader, (error, response) =>{
        if(error){
            callback('Unable to connect to VALR services!', undefined)
        }else if(response.body.error){
            callback('Unable to view balance', undefined)
        }else{
            callback(undefined, {
                usdt: response.body.markPrice
            });
        }
    });
}

//-----------------------------------------------------------------
// Exporting marketSummaryUSDT method 
module.exports = marketSummaryUSDT

//-----------------------------------------------------------------
// End of marketSummaryUSDT.js 
//-----------------------------------------------------------------