//-----------------------------------------------------------------
// Start of sendVerification.js -- responsible for send OTP to a given number 
//-----------------------------------------------------------------

//------------------------------------------------------------------------
// Initialzing packages for Twilio Authentication
const {serviceID, accountSID, authToken} = require('../api/constantVariables/variables')
const client = require('twilio')(accountSID, authToken)

//-----------------------------------------------------------------
// sendVerification Method Header, with phoneNumber as a parameter
const sendVerification = (phoneNumber, callback)=>{

    client
        .verify
        .v2.services(serviceID)
        .verifications
        .create({
            to: phoneNumber,
            channel: 'sms'
        })
        .then((data) =>{
            callback({
                result: data
            });
        }).catch((err) =>{
            callback({
                error: 'not a valid phone number'
            });
        });
}

//-----------------------------------------------------------------
// Exporting sendVerification Method 
module.exports = sendVerification

//-----------------------------------------------------------------
// End of sendVerification.js 
//-----------------------------------------------------------------

