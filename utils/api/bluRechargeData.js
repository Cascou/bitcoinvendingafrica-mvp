//-----------------------------------------------------------------
// Start of bluRechargeData.js -- responsible for creating the Blu Voucher Data Voucher 
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const request = require('postman-request')
const {bluSellKey, bluAuthorization} = require('./constantVariables/variables')
//Initializing Path & Body Variables needed
const bluUrl = 'https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/sales';

//-----------------------------------------------------------------
// createDataVoucher Method Header

const createDataVoucher =  (requestID, vendorId, productId, mobileNumber, callback)=>{

    const dataHeader = {
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
            'productId': productId,
            'mobileNumber': mobileNumber
        },
        json: true
    };

    request(dataHeader, (error, response) =>{
        if(error){
            callback('Unable to connect to services', undefined);
        }else{
            callback(undefined,  {
                vendor: response.body.vendorName,
                amount: response.body.amount,
                transRef: response.body.reference,
                time: response.body.dateTime     
            });
        }
    });
}

//-----------------------------------------------------------------
// Exporting createDataVoucher method 
module.exports = createDataVoucher 

//-----------------------------------------------------------------
// End of bluRechargeData.js 
//-----------------------------------------------------------------