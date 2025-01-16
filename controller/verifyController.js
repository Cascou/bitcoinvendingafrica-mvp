//-------------------------------------------------------------------------
// Start of verifyController.js -- Responsible for sending checking the OTP sent to the number
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Importing all npm packages necessary
const {isMobilePhone} = require('validator');

//-------------------------------------------------------------------------
// Importing all Libraries necessary
const sendVerification = require('../utils/api/sendVerification');

//-------------------------------------------------------------------------
// Get OTP verification API 
module.exports.verify_get = (req,res) =>{

    const myNumber = "+" + req.query.phoneNumber;
    const checkPhone = isMobilePhone(myNumber,'en-ZA', {strictMode: true});

    if(checkPhone===false){
        return res.status(400).send({
            status: 'Bad Request',
            error: 'Incorrect phone number, try again'
        });
    }else{
        //calls sendVerification Method, to send OTP to user.
        sendVerification("'" + myNumber+  "'", (err, response)=>{
            return res.status(200).send({
                status: 'OK',
                response: response
            });
        });
    }
}

//-------------------------------------------------------------------------
// End of verifyController.js
//-------------------------------------------------------------------------
