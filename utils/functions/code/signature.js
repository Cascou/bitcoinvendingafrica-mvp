//-----------------------------------------------------------------
// Start of signature.js -- responsible for hashing request headers for Valr API's
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const crypto = require('crypto');

//-----------------------------------------------------------------
//Passes through all declared literals as parameters, and returns a hashed output.
function requestSignature(mySecret, timestamp, verb, path, body){
    return crypto
    .createHmac('sha512', mySecret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(path)
    .update(body)
    .digest('hex')
}

//-----------------------------------------------------------------
// Exporting requestSignature function
module.exports = requestSignature;

//-----------------------------------------------------------------
// End of signature.js
//-----------------------------------------------------------------