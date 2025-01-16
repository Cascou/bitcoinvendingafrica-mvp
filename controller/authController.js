//-------------------------------------------------------------------------
// Start of authController.js -- Creates all the GET/POST function for Authenticating users.
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Importing all npm packages necessary
const {isMobilePhone} = require('validator');
const jwt = require('jsonwebtoken');

//------------------------------------------------------------------------
// Importing all Libraries necessary
const checkUser = require('../utils/functions/database/scripts/checkUser');
const insertUser = require('../utils/functions/database/scripts/insertUser');
const fetchPin = require('../utils/functions/database/scripts/fetchPin');
const fetchUserID = require('../utils/functions/database/scripts/fetchUserID');
const updateUser = require('../utils/functions/database/scripts/updateUser');
const bcryptjs = require('bcryptjs');
const { decrypt } = require('../utils/functions/code/hashPin');
const {jwtSecret} = require('../utils/api/constantVariables/variables');

//------------------------------------------------------------------------
// Initialzing packages for Twilio Authentication
const {serviceID, accountSID, authToken} = require('../utils/api/constantVariables/variables');
const client = require('twilio')(accountSID, authToken);

//------------------------------------------------------------------------
// Create JSON Web Tokens Function
const maxAge = 1 * 60 * 60;//sets age of expiry

const createToken = (number) =>{
    return jwt.sign({number}, jwtSecret, {
        expiresIn: maxAge
    });
}

//-------------------------------------------------------------------------
// Get Register Page
module.exports.register_get = (req,res) =>{
    res.render('register'); //calls 'register' page from templates
}

//-------------------------------------------------------------------------
// Post Register API 
module.exports.register_post = async (req,res) =>{
    
    const {phoneNumber, pinNumber, otpPin} = req.body;
    
    try{
        
        //if-statement input validating all fields were entered.    
        if(phoneNumber === undefined || pinNumber === undefined || otpPin ===undefined){
            return res.status(400).send({
                status: 'Bad Request',
                error:'Not all fields are entered'
            });
        }else{
            
            //checking if the number is authentic, through npm 'Validator'
            const checkPhone = isMobilePhone(phoneNumber,'en-ZA', {strictMode: true});

            if(checkPhone===false){
                return res.status(400).send({
                    status: 'Bad Request',
                    phoneError: 'Incorrect Number'
                });
            }else{
                
                var newNumber = phoneNumber.replace('+', '');//removes + from number

                //calls checkUser Method, to see if phoneNumber exists in db.
                await checkUser(newNumber, (checkErr, checkResponse) => {
                    if(checkErr){
                        return res.status(404).send({
                            status: 'Not Found',
                            error: checkErr
                        });
                    }else if (checkResponse.result === '1'){

                        //calls fetchPin to fetch userPin associated with phoneNumber
                        fetchPin(newNumber, async (pinErr, pinResponse)=>{
                            if(pinErr){
                                return res.status(404).send({
                                    status: 'Not Found',
                                    pinError: pinErr
                                });
                            }

                            //checks if passwords match
                            const passwordCompare = await bcryptjs.compare('BVA-PassTemp', pinResponse.pin);


                            if(!passwordCompare){
                                return res.status(400).send({
                                    status: 'Bad Request',
                                    phoneError: 'phone number exists already.'
                                });
                            }else{
                                
                                fetchUserID(newNumber, (userIDErr, userIDRes)=>{
                                    if(userIDErr){
                                        return res.status(404).send({
                                            status: 'Not Found',
                                            error: userIDErr
                                        });
                                    }

                                    try{
                                        //Checks whether OTP's Match
                                        client
                                        .verify
                                        .v2.services(serviceID)
                                        .verificationChecks
                                        .create({
                                            to: phoneNumber,
                                            code: otpPin
                                        })
                                        .then((data) =>{
                                            if(data.status === "approved"){

                                                //calls updateUser Method, to enter user details in db.
                                                bcryptjs.hash(pinNumber, 10)
                                                .then(hash =>{

                                                    updateUser(userIDRes.ID, hash);
                                                });
                                                
                                                //returns successful http response
                                                res.status(201).send({
                                                    status: 'Created',
                                                    result: 'Successfully Registered.'
                                                });
                                            }else{
                                                res.status(400).send({
                                                    status: 'Bad Request',
                                                    otpError: 'Invalid OTP'
                                                });
                                            }
                                        });
                                    } catch (Exception ){
                                        res.status(400).send({
                                            status: 'Bad Request',
                                            otpError: 'Invalid OTP'
                                        });
                                    }   
                                });
                            }
                        });
                    }else{

                        try{
                            //Checks whether OTP's Match
                            client
                            .verify
                            .v2.services(serviceID)
                            .verificationChecks
                            .create({
                                to: phoneNumber,
                                code: otpPin
                            })
                            .then((data) =>{
                                if(data.status === "approved"){
    
                                    //Creating Timestamp
                                    const currentDate = new Date();
                                    const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                    //calls updateUser Method, to enter user details in db.
                                    bcryptjs.hash(pinNumber, 10)
                                    .then(hash =>{

                                        //calls insertUser Method, to enter user details in db.
                                        insertUser(newNumber, hash, formattedDate);
                                    });
                                    
                                    //returns successful http response
                                    res.status(201).send({
                                        status: 'Created',
                                        result: 'Successfully Registered.'
                                    });
                                }else{
                                    res.status(400).send({
                                        status: 'Bad Request',
                                        otpError: 'Invalid OTP'
                                    });
                                }
                            });
                        } catch (Exception ){
                            res.status(400).send({
                                status: 'Bad Request',
                                otpError: 'Invalid OTP'
                            });
                        } 
                    }
                });
            }
        }
    }
    catch(err){
        return res.status(500).send({
            status: 'Internal Server Error',
            error: 'The server encountered an unexpected condition which prevented it from fulfilling the request.'
        });
    }
}

//-------------------------------------------------------------------------
// Get Login Page
module.exports.login_get = (req,res) =>{
    res.render('login'); //calls 'login' page from templates
}

//-------------------------------------------------------------------------
// Post Login API
module.exports.login_post = async (req,res) =>{
    
    const {phoneNumber, pinNumber} = req.body;
    
    try{

        const myNumber = phoneNumber//sets 'myNumber' variable equal to phoneNumber.
        
        //if-statement to input validate all fields were entered
        if(phoneNumber === undefined || pinNumber === undefined){
            return res.status(400).send({
                status: 'Bad Request',
                error:'Not all fields are entered'
            });
        }else{

            //checking if the number is authentic, through npm 'Validator'
            const checkPhone = isMobilePhone(myNumber,'en-ZA', {strictMode: true})

            if(checkPhone===false){
                return res.status(400).send({
                    status: 'Bad Request',
                    phoneError: 'Incorrect Number'
                });
            }else{

                var newNumber = phoneNumber.replace('+', '');//removes + from number
                
                //calls checkUser to see if phoneNumber exists in db.
                await checkUser(newNumber, (checkErr, checkResponse) => {
                    if(checkErr){
                        return res.status(404).send({
                            status: 'Not Found',
                            error: checkErr
                        });
                    }
                    
                    if (checkResponse.result === '1'){

                        //calls fetchPin to fetch userPin associated with phoneNumber
                        fetchPin(newNumber, async (pinErr, pinResponse)=>{
                            if(pinErr){
                                return res.status(404).send({
                                    status: 'Not Found',
                                    pinError: pinErr
                                });
                            }
        
                            //checks if passwords match
                            const passwordCompare = await bcryptjs.compare('BVA-PassTemp', pinResponse.pin);

                            //checks if passwords match
                            const realPasswordCompare = await bcryptjs.compare(pinNumber, pinResponse.pin);

                            if(passwordCompare){
                                return res.status(400).send({
                                    status: 'Bad Request',
                                    pinError: 'Partially registered, please complete registration.'
                                });
                            }else if(realPasswordCompare){

                                const token = createToken(phoneNumber);

                                res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000});
    
                                return res.status(201).send({
                                    status: 'Created',
                                    user: phoneNumber,
                                    result: 'Login Successful ' 
                                });
                            }else{
                                return res.status(400).send({
                                    status: 'Bad Request',
                                    pinError: 'Incorrect Pin'
                                });
                            }
                        });
                    }else{
                        return res.status(400).send({
                            status: 'Bad Request',
                            error: 'Number does not exist, try again or register'
                        });
                    }
                });
            }
        }    
    }
    catch(err){
        return res.status(500).send({
            status: 'Internal Server Error',
            error: 'The server encountered an unexpected condition which prevented it from fulfilling the request.'
        });
    };
}

//-------------------------------------------------------------------------
// Get Logout Function
module.exports.logout_get = (req, res) => {
    
    //fetches cookie, and reset age.
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');//redirects to default page
}

//-------------------------------------------------------------------------
// End of authController.js
//-------------------------------------------------------------------------