//-------------------------------------------------------------------------
// Start of dashboardController.js -- Creates all the GET/POST function for dashboard features
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Importing all npm packages necessary
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const moment = require('moment-timezone');
const {isMobilePhone} = require('validator');
var WAValidator = require('multicoin-address-validator');

//------------------------------------------------------------------------
// Importing all Libraries necessary
const checkBalance = require('../utils/functions/database/scripts/checkBalance');
const checkUser = require('../utils/functions/database/scripts/checkUser');
const fetchPin = require('../utils/functions/database/scripts/fetchPin');
const fetchUserID = require('../utils/functions/database/scripts/fetchUserID');
const voucherStatus = require('../utils/api/checkVoucher');
const redeemVoucher = require('../utils/api/redeemVoucher');
const createBluVoucher = require('../utils/api/createBluVoucher');
const marketOrder = require('../utils/api/marketOrder');
const sellOrder = require('../utils/api/sellOrder');
const marketHistory = require('../utils/api/marketHistory');
const createVoucher = require('../utils/functions/database/scripts/createVoucher');
const fetchRequestID = require('../utils/functions/database/scripts/fetchRequestID');
const insertRedemption = require('../utils/functions/database/scripts/insertRedemption');
const insertTransaction = require('../utils/functions/database/scripts/insertTransaction');
const insertVoucher = require('../utils/functions/database/scripts/insertVoucher');
const updateWalletBeneficiary = require('../utils/functions/database/scripts/updateWalletBeneficiary');
const insertWalletBeneficiary = require('../utils/functions/database/scripts/insertWalletBeneficiary');
const insertMobileBeneficiary = require('../utils/functions/database/scripts/insertMobileBeneficiary');
const updateMobileBeneficiary = require('../utils/functions/database/scripts/updateMobileBeneficiary');
const insertUser = require('../utils/functions/database/scripts/insertUser');
const bcryptjs = require('bcryptjs');
const checkWalletBeneficiary = require('../utils/functions/database/scripts/checkWalletBeneficiary');
const checkMobileBeneficiary = require('../utils/functions/database/scripts/checkMobileBeneficiary');
const insertWalletTransaction = require('../utils/functions/database/scripts/insertWalletTransaction');
const {decrypt} = require('../utils/functions/code/hashPin');
const {btcMinWithdrawal, btcFee, usdtMinWithdrawal, usdtFee} = require('../utils/api/constantVariables/variables');


//-----------------------------------------------------------------
// Get Dashboard Page
module.exports.dashboard_get = (req,res) =>{
    res.render('dashboard');//calls 'dashboard' page found in templates.
}

//-----------------------------------------------------------------
// Get Balance Page
module.exports.balance_get = (req,res) =>{
    res.render('balance');//calls 'balance' page found in templates.
}

//-----------------------------------------------------------------
// Balance Post Method
module.exports.balance_post = async (req,res) =>{

    const {phoneNumber} = req.body;
    
    try{

        //Calls checkBalance Method, with phoneNumber as parameter. 
        //Checks balance stored in db, that is associated with phoneNumber.
        await checkBalance(phoneNumber, (checkErr, checkResponse) => {
            if(checkErr){
                return res.status(500).send({
                    status: 'Internal Server Error',
                    error: checkErr
                });
            }else{
                return res.status(200).send({
                    BTC: checkResponse.btc,
                    USDT: checkResponse.usdt
                });
            }
        });
    }
    catch(err){
        return res.send({
            error: err
        });
    };
}

//-----------------------------------------------------------------
// Get Buy Page
module.exports.buy_get = (req,res) =>{
    res.render('buy');//calls 'buy' page found in templates.
}

//-------------------------------------------------------------------------
// Post BUY API
module.exports.buy_post = async (req,res) =>{

    const {voucherDetail, pin, phoneNumber, currency} = req.body;

    const bvaFee = 0.10;//setting percentage take for trade.

    let amount = 0;//variable to store amount found in voucher(in cents)

    try{

        //if-statement to ensure input validation.
        if(voucherDetail === undefined || pin ===undefined || phoneNumber===undefined || currency===undefined){
            return res.status(400).send({
                status: 'Bad Request',
                error:'Not all fields were entered.'
            });
        }else{
            
            //calls voucherStatus method, parameter = voucherPin
            //gets details of BluLabel voucher
            await voucherStatus(voucherDetail, (voucherErr, voucherResponse)=>{
                if(voucherErr){
                    return res.status(400).send({
                        status: 'Bad Request',
                        error: voucherErr
                    });
                }else if(voucherResponse.status === 'NOT_FOUND'){
                    return res.status(400).send({
                        status: 'Bad Request',
                        voucherError: 'Invalid Voucher Pin'
                    });
                }else if(voucherResponse.status === 'REDEEMED'){
                    return res.status(400).send({
                        status: 'Bad Request',
                        voucherError: 'Voucher Pin already used'
                    });
                }else if(voucherResponse.amount < 2000){
                    return res.status(400).send({
                        status: 'Bad Request',
                        voucherError: 'Voucher Amount is too low for redemption'
                    });
                }else{

                    amount = voucherResponse.amount;//sets amount variable as the amount depicted in the voucher.

                    //checks if the voucher is valid(by checking the voucher's status (Active/Redeemed))
                    if(voucherResponse.status ==='ACTIVE'){
                        
                        //calls checkUser Method, to see if the phoneNumber exists in the DB.
                        checkUser(phoneNumber, (userErr, userResponse) => {
                            if(userErr){
                                return res.status(404).send({
                                    status: 'Not Found',
                                    error: userErr
                                });
                            }else{

                                //if user is found, result should be 1, if not; 0
                                if (userResponse.result === '1'){
                                    
                                    //calls fetchPin Method, to fetch Pin associated with number in db.
                                    fetchPin(phoneNumber, async (pinErr, pinResponse)=>{
                                        if(pinErr){
                                            return res.status(404).send({
                                                status: 'Not Found',
                                                pinError: pinErr
                                            });
                                        }

                                        //checks if passwords match
                                        const realPasswordCompare = await bcryptjs.compare(pin, pinResponse.pin);

                                        //if-statement to see if the pin user entered is the same.
                                        if(realPasswordCompare){

                                            //fetch userID, for db insert methods.
                                            fetchUserID(phoneNumber, (userIdErr, userIdResponse)=>{
                                                if(userIdErr){
                                                    return res.status(404).send({
                                                        status: 'Not Found',
                                                        error: userIdErr
                                                    });
                                                }

                                                const userID = userIdResponse.ID;//set ID to equal userID variable.

                                                const requestID = uuidv4();//Create a Unique requestID, to redeem voucher.

                                                //calls redeemVoucher, that redeems voucher from BluLabel.
                                                redeemVoucher(requestID, voucherDetail, amount, (redeemErr, redeemResponse)=>{
                                                    if(redeemErr){
                                                        return res.status(500).send({
                                                            status: 'Internal Server Error',
                                                            error: redeemErr
                                                        });
                                                    }else{

                                                        //Creating Timestamp
                                                        const currentDate = new Date();
                                                        const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                                        //inserts redemption details in db
                                                        insertRedemption(userID,voucherDetail, amount, requestID, formattedDate)

                                                        const amountInRands = amount/100;//get value of cents in rands
                                                        const amountFee = amountInRands * bvaFee;//get value of company percentage taken.
                                                        const tradedAmount = amountInRands - amountFee;//the amount that will be traded

                                                        //calls marketOrder method to make purchase through VALR API.
                                                        marketOrder(tradedAmount, phoneNumber,'BUY', currency, (orderErr, orderResponse)=>{
                                                            if(orderErr){
                                                                return res.status(500).send({
                                                                    status:'Internal Server Error',
                                                                    error: orderErr
                                                                });
                                                            }else{

                                                                //calls marketHistory method to check transactions details with transactionID.
                                                                marketHistory(orderResponse.result.body.id, (historyErr, historyResponse)=>{
                                                                    if(historyErr){
                                                                        return res.status(404).send({
                                                                            status: 'The requested resource could not be found',
                                                                            error: historyErr
                                                                        });
                                                                    }else{

                                                                        //insert details of transaction purchase into db
                                                                        if(currency === 'BTC'){
                                                                            //Creating Timestamp
                                                                            const currentDate = new Date();
                                                                            const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);
                                                                            
                                                                            //if BTC was bought
                                                                            insertTransaction(userID, phoneNumber, "'" + historyResponse.orderId+ "'", "'" + JSON.stringify(historyResponse.jsonResponse) + "'",amountInRands, tradedAmount, amountFee,"'" +  historyResponse.orderSide + "'", "'" + currency + "'", historyResponse.currencyPrice, historyResponse.valrFee, historyResponse.balance, 0, formattedDate)
                                                                        }else{
                                                                            //Creating Timestamp
                                                                            const currentDate = new Date();
                                                                            const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                                                            //if USDC was bought
                                                                            insertTransaction(userID, phoneNumber, "'" + historyResponse.orderId+ "'", "'" + JSON.stringify(historyResponse.jsonResponse) + "'",amountInRands, tradedAmount, amountFee, "'" + historyResponse.orderSide + "'", "'" + currency + "'", historyResponse.currencyPrice, historyResponse.valrFee, 0, historyResponse.balance, formattedDate)
                                                                        }                                                                    

                                                                        res.status(201).send({
                                                                            status: 'Created',
                                                                            result: 'Successfully Purchased Cryptocurrency with the voucher.',
                                                                            currencyAmount: historyResponse.balance
                                                                        });
                                                                    }//end-else
                                                                });//end-marketHistory
                                                            }//end-else
                                                        });//end-marketOrder
                                                    }//end-else
                                                });//end-redeemVoucher
                                            });//end-fetchUserID
                                        }else{
                                            return res.status(403).send({
                                                status: 'Forbidden',
                                                pinError: 'Incorrect Pin.'
                                            });
                                        }
                                    });//end-fetchPin
                                }//end-if
                            }//end-else
                        });//end-checkUser
                    }//end-if
                }
            });//end-voucherStatus
        }//end-else
    }
    catch(err){
        return res.status(500).send({
            status: 'Internal Server Error',
            error: 'The server encountered an unexpected condition which prevented it from fulfilling the request.'
        });
    };
}

//-----------------------------------------------------------------
// Get Sell Page
module.exports.sell_get = (req,res) =>{
    res.render('sell');//calls 'sell' page found in templates.
}

//-------------------------------------------------------------------------
// Post SELL API
module.exports.sell_post = async (req, res) =>{

    const {pin, phoneNumber, amount, marketPrice, currency} = req.body;
    
    try{
        
        //if-statement to ensure input validation.
        if(pin ===undefined || phoneNumber===undefined || amount === undefined || currency===undefined){
            return res.status(400).send({
                status: 'Bad Request',
                error:'Not all fields were entered.'
            });
        }else if (amount * marketPrice >990){
            return res.status(400).send({
                status: 'Bad Request',
                error:'The amount entered is too high to create a voucher'
            });
        }else if (amount * marketPrice <25){
            return res.status(400).send({
                status: 'Bad Request',
                error:'The amount entered is too little to create a voucher'
            });
        }else{

            await checkUser(phoneNumber, (userErr, userResponse) => {
                if(userErr){
                    return res.status(404).send({
                        status: 'Not Found',
                        error: userErr
                    });
                }else{

                    //if user is found, result should be 1, if not; 0
                    if (userResponse.result === '1'){

                        //calls fetchPin Method, to fetch Pin associated with number in db.
                        fetchPin(phoneNumber, async (pinErr, pinResponse)=>{
                            if(pinErr){
                                return res.status(404).send({
                                    status: 'Not Found',
                                    error: pinErr
                                });
                            }

                            //checks if passwords match
                            const realPasswordCompare = await bcryptjs.compare(pin, pinResponse.pin);

                            //if-statement to see if the pin user entered is the same.
                            if(realPasswordCompare){

                                checkBalance(phoneNumber, (checkBalanceErr, checkBalanceResponse)=>{
                                    if(checkBalanceErr){
                                        return res.status(404).send({
                                            status: 'Not Found',
                                            error: checkBalanceErr
                                        });
                                    }else if(checkBalanceResponse.btc==='null'){
                                        return res.status(400).send({
                                            status: 'Bad Request',
                                            error:'Insufficient Funds to Sell.'
                                        });
                                    }else if(checkBalanceResponse.btc<='0' && currency ==='BTC'){
                                        return res.status(400).send({
                                            status: 'Bad Request',
                                            error:'Insufficient BTC to Sell.'
                                        });
                                    }else if(checkBalanceResponse.usdt==='0' && currency ==='USDT'){
                                        return res.status(400).send({
                                            status: 'Bad Request',
                                            error:'Insufficient USDT to Sell.'
                                        });
                                    }else if(currency==='USDT' && Number(checkBalanceResponse.usdt)<amount){
                                        return res.status(400).send({
                                            status: 'Bad Request',
                                            error:'Insufficient USDC to Sell.'
                                        });
                                    }
                                    else if(currency==='BTC' && Number(checkBalanceResponse.btc)<amount){
                                        return res.status(400).send({
                                            status: 'Bad Request',
                                            error:'Insufficient BTC to Sell.'
                                        });
                                    }
                                    else{

                                        let myAmount = amount;
                                                                                
                                        //fetch userID, for db insert methods.
                                        fetchUserID(phoneNumber, (userIdErr, userIdResponse)=>{
                                            if(userIdErr){
                                                return res.status(404).send({
                                                    status: 'Not Found',
                                                    error: userIdErr
                                                });
                                            }else{
                                                const userID = userIdResponse.ID;//set ID to equal userID variable.
                                                var creationDate = new Date();

                                                // Convert the current time to GMT+2
                                                const gmt2Time = moment(creationDate).tz('Europe/Amsterdam').add(2, 'hours');
                                                // Format the GMT+2 time as an ISO string
                                                const myDate = gmt2Time.toISOString();
                                                

                                                createVoucher(userID, "'" + myDate + "'");

                                                //calls marketOrder method to make purchase through VALR API.
                                                sellOrder(myAmount, phoneNumber,'SELL', currency, (sellOrderErr, sellOrderResponse)=>{
                                                    if(sellOrderErr){
                                                        return res.status(500).send({
                                                            status:'Internal Server Error',
                                                            error: sellOrderErr
                                                        });
                                                    }else{
                                                        
                                                        //calls marketHistory method to check transactions details with transactionID.
                                                        marketHistory(sellOrderResponse.result.body.id, (historyErr, historyResponse)=>{
                                                            if(historyErr){
                                                                return res.status(404).send({
                                                                    status: 'The requested resource could not be found',
                                                                    error: historyErr
                                                                });
                                                            }else{

                                                                //-------------------------------------------------------------------------------
                                                                //Math Variables to Calculate Voucher Amount
                                                                //-------------------------------------------------------------------------------
                                                                let amountInRands = 0;
                                                                let zarAmount = 0;
                                                                let stringAmount = '';
                                                                let centAmount = 0;
                                                                
                                                                amountInRands = Number(historyResponse.currencyPrice) * myAmount;
                                                                zarAmount = amountInRands - historyResponse.valrFee;
                                                                zarAmount = zarAmount.toFixed(2);
                                                                stringAmount = zarAmount.toString();
                                                                stringAmount = stringAmount.replace('.', '');
                                                                centAmount = Number(stringAmount);
                                                                
                                                                //-------------------------------------------------------------------------------

                                                                //-------------------------------------------------------------------------------
                                                                //insert details of sell order into db
                                                                if(currency === 'BTC'){
                                                                    //Creating Timestamp
                                                                    const currentDate = new Date();
                                                                    const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                                                    //if BTC was bought
                                                                    insertTransaction(userID, phoneNumber, "'" + historyResponse.orderId+ "'", "'" + JSON.stringify(historyResponse.jsonResponse) + "'",0, 0, 0,"'" +  historyResponse.orderSide + "'", "'" + currency + "'", historyResponse.currencyPrice, historyResponse.valrFee, '-' + myAmount, 0, formattedDate)
                                                                }else{
                                                                    //Creating Timestamp
                                                                    const currentDate = new Date();
                                                                    const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                                                    //if USDC was bought
                                                                    insertTransaction(userID, phoneNumber, "'" + historyResponse.orderId+ "'", "'" + JSON.stringify(historyResponse.jsonResponse) + "'",0, 0, 0, "'" + historyResponse.orderSide + "'", "'" + currency + "'", historyResponse.currencyPrice, historyResponse.valrFee, 0, '-' + myAmount, formattedDate)
                                                                }

                                                                fetchRequestID(userID, "'" + myDate + "'", (fetchRequestErr, fetchRequestResponse) =>{
                                                                    if(fetchRequestErr){
                                                                        return res.status(404).send({
                                                                            status: 'Not Found',
                                                                            error: fetchRequestErr
                                                                        });
                                                                    }else{

                                                                        const myRequestID = fetchRequestResponse.requestID;
                                                                        const hashedRequestID = crypto.createHash('md5').update(myRequestID).digest('hex');
                                                                                                                                                
                                                                        createBluVoucher(hashedRequestID, myDate, phoneNumber, centAmount, (createErr, createResponse)=>{
                                                                            if(createErr){
                                                                                return res.status(500).send({
                                                                                    status: 'Internal Server Error',
                                                                                    error: createErr
                                                                                });
                                                                            }else{
                                                                                //insert into voucher details into db
                                                                                insertVoucher(userID, "'" + hashedRequestID + "'", 7, centAmount, createResponse.token, myRequestID, phoneNumber);
                                                                                
                                                                            
                                                                                res.status(201).send({
                                                                                    status: 'Created',
                                                                                    result: 'Sucessfuly Created the voucher',
                                                                                    token: createResponse.token,
                                                                                    amount: createResponse.amount,
                                                                                    serial: createResponse.serial,
                                                                                    transRef: createResponse.transRef, 
                                                                                    instruction: createResponse.instruction
                                                                                });
                                                                            }//end-else
                                                                        });//end-createBluVoucher
                                                                    }//end-else
                                                                });//end-fetchRequestID
                                                            }//end-else
                                                        });//end-marketHistory
                                                    }//end-else
                                                });//end-sellOrder
                                            }//end-else
                                        });//end-fetchUserID
                                    }//end-else
                                });//end-checkBalance
                            }else{
                                return res.status(403).send({
                                    status: 'Forbidden',
                                    pinError: 'Incorrect Pin.'
                                });
                            }//end-if
                        });//end-fetchPin
                    }//end-if
                }//end-else
            });//end-checkUser
        }//end-else
    }
    catch(err){
        return res.status(500).send({
            status: 'Internal Server Error',
            error: 'The server encountered an unexpected condition which prevented it from fulfilling the request.'
        });
    };   
}

//-------------------------------------------------------------------------
// Post Edit Wallet Beneficiary API
module.exports.editWalletBeneficiary_post = async (req, res) =>{

    const {beneficiaryID, beneficiaryName, walletAddress, currency} = req.body;
    
    if (beneficiaryID === undefined || beneficiaryName === undefined || walletAddress === undefined || currency === undefined) {
        return res.status(400).send({
            status: 'Bad Request',
            error: 'Not all fields were entered.'
        });
    }else
    {
        var valid;

        if(currency==='BTC'){
            valid = WAValidator.validate(walletAddress, 'btc');
        }else{
            valid = WAValidator.validate(walletAddress, 'usdt')
        }

        if(valid === true){
            try{
                //Creating Timestamp
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                const hashedBeneficiary = CryptoJS.SHA256(walletAddress).toString();
                updateWalletBeneficiary(beneficiaryID, beneficiaryName, walletAddress, currency, hashedBeneficiary, formattedDate);

                return res.status(200).send({
                    status: 'Good Request',
                    result: 'Successfully Updated Beneficiary'
                });
            } catch (updateErr) {
                return res.status(500).send({
                    status: 'Internal Server Error',
                    error: updateErr
                });
            }
        }else{
            return res.status(400).send({
                status: 'Bad Request',
                error: 'Invalid Address'
            });
        }
    }   
}

//-----------------------------------------------------------------
// Get Add Wallet Beneficiary Page
module.exports.addWalletBeneficiary_get = (req,res) =>{
    res.render('addWalletBeneficiary');//calls 'addWalletBeneficiary' page found in templates.
}

//-------------------------------------------------------------------------
// Post Add Wallet Beneficiary API
module.exports.addWalletBeneficiary_post = async (req, res) =>{
    const {phoneNumber, beneficiaryName, walletAddress, currency} = req.body;
    
    if (phoneNumber === undefined || beneficiaryName === undefined || walletAddress === undefined || currency === undefined) {
        return res.status(400).send({
            status: 'Bad Request',
            error: 'Not all fields were entered.'
        });
    }else
    {
        var valid;

        if(currency==='BTC'){
            valid = WAValidator.validate(walletAddress, 'btc');
        }else{
            valid = WAValidator.validate(walletAddress, 'usdt')
        }

        if(valid === true){
            try{
                await fetchUserID(phoneNumber, (fetchErr, fetchRes)=>{
                    if(fetchErr){
                        return res.status(404).send({
                            status: 'Not Found',
                            error: fetchErr
                        });
                    }else{
                        checkWalletBeneficiary("'" + walletAddress +"'", (checkWalletErr, checkWalletRes)=>{
                            if(checkWalletErr){
                                return res.status(404).send({
                                    status: 'Not Found',
                                    error: checkWalletErr
                                });
                            }else if (checkWalletRes.result === '1'){
                                return res.status(400).send({
                                    status: 'Bad Request',
                                    error: 'Address already exists'
                                });
                            }else{

                                //Creating Timestamp
                                const currentDate = new Date();
                                const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                const hashedBeneficiary = CryptoJS.SHA256(walletAddress).toString();
                                insertWalletBeneficiary(fetchRes.ID, beneficiaryName, walletAddress, currency, hashedBeneficiary, formattedDate);

                                return res.status(200).send({
                                    status: 'Good Request',
                                    result: 'Successfully Added Beneficiary'
                                });
                            }
                        });
                    }
                });
            } catch (updateErr) {
                return res.status(500).send({
                    status: 'Internal Server Error',
                    error: updateErr
                });
            }
        }else{
            return res.status(400).send({
                status: 'Bad Request',
                error: 'Invalid Address'
            });
        }
    }   
}

//-----------------------------------------------------------------
// Get Add Mobile Beneficiary Page
module.exports.addMobileBeneficiary_get = (req,res) =>{
    res.render('addMobileBeneficiary');//calls 'addMobileBeneficiary' page found in templates.
}

//-----------------------------------------------------------------
// Post Add Mobile Beneficiary API
module.exports.addMobileBeneficiary_post = async (req, res) =>{
    const {phoneNumber, beneficiaryName, mobileAddress, currency} = req.body;

    if (phoneNumber === undefined || beneficiaryName === undefined || mobileAddress === undefined || currency === undefined) {
        return res.status(400).send({
            status: 'Bad Request',
            error: 'Not all fields were entered.'
        });
    }else
    {
        var myNumber = String(mobileAddress);

        if(mobileAddress.startsWith('0', 0)===true){
            myNumber = myNumber.slice(1);
        }
        
        const finalPhoneNumber = "+" + "27" + myNumber;
        
        //checking if the number is authentic, through npm 'Validator'
        const checkPhone = isMobilePhone(finalPhoneNumber,'en-ZA', {strictMode: true});
        
        if(checkPhone===false){
            return res.status(400).send({
                status: 'Bad Request',
                error: 'Incorrect Number'
            });
        }else{

            var newNumber = finalPhoneNumber.replace('+', '');//removes + from number

            //calls checkUser Method, to see if phoneNumber exists in db.
            await checkUser(newNumber, (checkErr, checkResponse) => {
                if(checkErr){
                    return res.status(404).send({
                        status: 'Not Found',
                        error: checkErr
                    });
                }else if (checkResponse.result === '1'){
                    fetchUserID(phoneNumber, (fetchErr, fetchRes)=>{
                        if(fetchErr){
                            return res.status(404).send({
                                status: 'Not Found',
                                error: fetchErr
                            });
                        }else{
                            checkMobileBeneficiary(newNumber, (checkMobileErr, checkMobileRes)=>{
                                if(checkMobileErr){
                                    return res.status(404).send({
                                        status: 'Not Found',
                                        error: checkMobileErr
                                    });
                                }else if (checkMobileRes.result === '1'){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error: 'Mobile already exists'
                                    });
                                }else{

                                    //Creating Timestamp
                                    const currentDate = new Date();
                                    const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                    const hashedBeneficiary = CryptoJS.SHA256(newNumber).toString();
                                    insertMobileBeneficiary(fetchRes.ID, beneficiaryName, newNumber, currency, hashedBeneficiary, formattedDate);

                                    return res.status(200).send({
                                        status: 'Good Request',
                                        result: 'Successfully Added Beneficiary'
                                    });
                                }
                            });
                        }
                    });
                }else{

                    //Creating Timestamp
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                    bcryptjs.hash('BVA-PassTemp', 10)
                    .then(hash =>{
                        insertUser(newNumber, hash, formattedDate);
                    });

                    fetchUserID(phoneNumber, (fetchErr, fetchRes)=>{
                        if(fetchErr){
                            return res.status(404).send({
                                status: 'Not Found',
                                error: fetchErr
                            });
                        }else{

                            checkMobileBeneficiary(newNumber, (checkMobileErr, checkMobileRes)=>{
                                if(checkMobileErr){
                                    return res.status(404).send({
                                        status: 'Not Found',
                                        error: checkMobileErr
                                    });
                                }else if (checkMobileRes.result === '1'){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error: 'Mobile already exists'
                                    });
                                }else{

                                    //Creating Timestamp
                                    const currentDate = new Date();
                                    const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                    const hashedBeneficiary = CryptoJS.SHA256(newNumber).toString();
                                    insertMobileBeneficiary(fetchRes.ID, beneficiaryName, newNumber, currency, hashedBeneficiary, formattedDate);

                                    return res.status(200).send({
                                        status: 'Good Request',
                                        result: 'Successfully Added Beneficiary'
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}

//-------------------------------------------------------------------------
// Post Edit Mobile Beneficiary API
module.exports.editMobileBeneficiary_post = async (req, res) =>{

    const {beneficiaryID, beneficiaryName, mobileAddress, currency} = req.body;
    
    if (beneficiaryID === undefined || beneficiaryName === undefined || mobileAddress === undefined || currency === undefined) {
        return res.status(400).send({
            status: 'Bad Request',
            error: 'Not all fields were entered.'
        });
    }else
    {
        var myNumber = String(mobileAddress);

        if(mobileAddress.startsWith('0', 0)===true){
            myNumber = myNumber.slice(1);
        }

        const finalPhoneNumber = "+" + "27" + myNumber;
        
        //checking if the number is authentic, through npm 'Validator'
        const checkPhone = isMobilePhone(finalPhoneNumber,'en-ZA', {strictMode: true});
        
        if(checkPhone===false){
            return res.status(400).send({
                status: 'Bad Request',
                error: 'Incorrect Number'
            });
        }else{

            try{

                var newNumber = finalPhoneNumber.replace('+', '');//removes + from number
    
                //calls checkUser Method, to see if phoneNumber exists in db.
                await checkUser(newNumber, (checkErr, checkResponse) => {
                    if(checkErr){
                        return res.status(404).send({
                            status: 'Not Found',
                            error: checkErr
                        });
                    }else if (checkResponse.result === '1'){
    
                        //Creating Timestamp
                        const currentDate = new Date();
                        const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                        const hashedBeneficiary = CryptoJS.SHA256(newNumber).toString();
                        updateMobileBeneficiary(beneficiaryID, beneficiaryName, newNumber, currency, hashedBeneficiary, formattedDate);
    
                        return res.status(200).send({
                            status: 'Good Request',
                            result: 'Successfully Updated Beneficiary'
                        });
                    }else{

                        //Creating Timestamp
                        const currentDate = new Date();
                        const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                        bcryptjs.hash('BVA-PassTemp', 10)
                        .then(hash =>{
                            insertUser(newNumber, hash, formattedDate);
                        });

                        const hashedBeneficiary = CryptoJS.SHA256(newNumber).toString();
                        updateMobileBeneficiary(beneficiaryID, beneficiaryName, newNumber, currency, hashedBeneficiary, formattedDate);

                        return res.status(200).send({
                            status: 'Good Request',
                            result: 'Successfully Updated Beneficiary'
                        });
                    }
                });
            } catch (updateErr) {
                return res.status(500).send({
                    status: 'Internal Server Error',
                    error: updateErr
                });
            }
        }
    }   
}

//-----------------------------------------------------------------
// Post Send Mobile Beneficiary API
module.exports.sendMobileBeneficiary_post = async (req, res) =>{
    
    const {phoneNumber, mobileAddress, currency, amount, pin} = req.body;


    if (phoneNumber === undefined || mobileAddress === undefined || currency === undefined || amount === undefined || pin === undefined) {
        return res.status(400).send({
            status: 'Bad Request',
            error: 'Not all fields were entered.'
        });
    }else if (amount <= 0){
        return res.status(400).send({
            status: 'Bad Request',
            error:'The amount entered is too low to transfer'
        });
    }else if (amount === 'e'){
        return res.status(400).send({
            status: 'Bad Request',
            error:'The amount entered is not a number'
        });
    }else{

        await checkUser(phoneNumber, (userErr, userResponse) => {
            if(userErr){
                return res.status(404).send({
                    status: 'Not Found',
                    error: userErr
                });
            }else{

                //if user is found, result should be 1, if not; 0
                if (userResponse.result === '1'){

                    //calls fetchPin Method, to fetch Pin associated with number in db.
                    fetchPin(phoneNumber, async (pinErr, pinResponse)=>{
                        if(pinErr){
                            return res.status(404).send({
                                status: 'Not Found',
                                error: pinErr
                            });
                        }

                        //checks if passwords match
                        const realPasswordCompare = await bcryptjs.compare(pin, pinResponse.pin);
                        
                        //if-statement to see if the pin user entered is the same.
                        if(realPasswordCompare){

                            checkBalance(phoneNumber, (checkBalanceErr, checkBalanceResponse)=>{
                                if(checkBalanceErr){
                                    return res.status(404).send({
                                        status: 'Not Found',
                                        error: checkBalanceErr
                                    });
                                }else if(checkBalanceResponse.btc==='null'){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient Funds to Send.'
                                    });
                                }else if(checkBalanceResponse.btc<='0' && currency ==='BTC'){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient BTC to Send.'
                                    });
                                }else if(checkBalanceResponse.usdt==='0' && currency ==='USDT'){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient USDT to Send.'
                                    });
                                }else if(currency==='USDT' && Number(checkBalanceResponse.usdt)<amount){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient USDC to Send.'
                                    });
                                }
                                else if(currency==='BTC' && Number(checkBalanceResponse.btc)<amount){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient BTC to Send.'
                                    });
                                }
                                else{
                                    fetchUserID(mobileAddress, (beneficiaryFetchErr, beneficiaryFetchRes)=>{
                                        if(beneficiaryFetchErr){
                                            return res.status(404).send({
                                                status: 'Not Found',
                                                error: beneficiaryFetchErr
                                            });
                                        }

                                        fetchUserID(phoneNumber, (userFetchErr, userFetchRes)=>{
                                            if(userFetchErr){
                                                return res.status(404).send({
                                                    status: 'Not Found',
                                                    error: userFetchErr
                                                });
                                            }
                                            const myUserID =  userFetchRes.ID;
                                            const myBeneficiaryID = beneficiaryFetchRes.ID;
                                            const myPhoneNumber = "'" + phoneNumber + "'";
                                            const myCurrency = "'" +  currency + "'"
                                            const beneficiaryNumber = "'" + mobileAddress + "'";
                                            let myAmount = amount;
                                            let normalAmount = Number(amount);
                                            let stringAmount = myAmount.toString();
                                            stringAmount = stringAmount.replace('.', '');
                                            myAmount = Number(stringAmount);
                                            
                                            //-------------------------------------------------------------------------------
                                            //insert details of transfer into db
                                            if(currency === 'BTC'){
                                                //Creating Timestamp
                                                const currentDate = new Date();
                                                const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                                insertTransaction(myUserID, phoneNumber, beneficiaryNumber, "Non-applicable", 0,0,0, "Internal Transfer", myCurrency, 0, 0, '-' + normalAmount, 0, formattedDate);
                                                insertTransaction(myBeneficiaryID, mobileAddress, myPhoneNumber, "Non-applicable", 0,0,0, "Internal Receive", myCurrency, 0,0, normalAmount,0, formattedDate);
                                            }else{
                                                //Creating Timestamp
                                                const currentDate = new Date();
                                                const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                                insertTransaction(myUserID, phoneNumber, beneficiaryNumber, "Non-applicable", 0,0,0, "Internal Transfer", myCurrency, 0, 0, 0, '-' + normalAmount, formattedDate);
                                                insertTransaction(myBeneficiaryID, mobileAddress, myPhoneNumber, "Non-applicable", 0,0,0, "Internal Receive", myCurrency, 0,0, 0, normalAmount, formattedDate);
                                            }

                                            res.status(201).send({
                                                status: 'Created',
                                                result: 'Successfully Sent cryptocurrency'
                                            });
                                        });
                                    });
                                }
                            });
                        }else{
                            return res.status(403).send({
                                status: 'Forbidden',
                                pinError: 'Incorrect Pin.'
                            });
                        }
                    });
                }
            }
        });
    }
}

//-----------------------------------------------------------------
// Post Send Wallet Beneficiary API
module.exports.sendWalletBeneficiary_post = async (req, res) =>{

    const {phoneNumber, amount, address, currency, pin} = req.body;

    if (phoneNumber === undefined || amount === undefined || address === undefined || currency === undefined || pin === undefined) {
        return res.status(400).send({
            status: 'Bad Request',
            error: 'Not all fields were entered.'
        });
    }else if (amount <= 0){
        return res.status(400).send({
            status: 'Bad Request',
            error:'The amount entered is too low to transfer'
        });
    }else if (amount === 'e'){
        return res.status(400).send({
            status: 'Bad Request',
            error:'The amount entered is not a number'
        });
    }else if(currency === 'BTC' && amount < btcMinWithdrawal){
        return res.status(400).send({
            status: 'Bad Request',
            error:'Your btc withdrawal is lower than the minimum'
        });
    }else if(currency ==='USDT' && amount< usdtMinWithdrawal){
        return res.status(400).send({
            status: 'Bad Request',
            error:'Your usdt withdrawal is lower than the minimum'
        });
    }else{

        await checkUser(phoneNumber, (userErr, userResponse) => {
            if(userErr){
                return res.status(404).send({
                    status: 'Not Found',
                    error: userErr
                });
            }else{

                //if user is found, result should be 1, if not; 0
                if (userResponse.result === '1'){

                    //calls fetchPin Method, to fetch Pin associated with number in db.
                    fetchPin(phoneNumber, async (pinErr, pinResponse)=>{
                        if(pinErr){
                            return res.status(404).send({
                                status: 'Not Found',
                                error: pinErr
                            });
                        }

                        //checks if passwords match
                        const realPasswordCompare = await bcryptjs.compare(pin, pinResponse.pin);

                        //if-statement to see if the pin user entered is the same.
                        if(realPasswordCompare){

                            checkBalance(phoneNumber, (checkBalanceErr, checkBalanceResponse)=>{
                                if(checkBalanceErr){
                                    return res.status(404).send({
                                        status: 'Not Found',
                                        error: checkBalanceErr
                                    });
                                }else if(checkBalanceResponse.btc==='null'){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient Funds to Send.'
                                    });
                                }else if(checkBalanceResponse.btc<='0' && currency ==='BTC'){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient BTC to Send.'
                                    });
                                }else if(checkBalanceResponse.usdt==='0' && currency ==='USDT'){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient USDT to Send.'
                                    });
                                }else if(currency==='USDT' && Number(checkBalanceResponse.usdt)<amount){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient USDC to Send.'
                                    });
                                }else if(currency==='BTC' && Number(checkBalanceResponse.btc)<amount){
                                    return res.status(400).send({
                                        status: 'Bad Request',
                                        error:'Insufficient BTC to Send.'
                                    });
                                }else{
                                    fetchUserID(phoneNumber, (userFetchErr, userFetchRes)=>{
                                        if(userFetchErr){
                                            return res.status(404).send({
                                                status: 'Not Found',
                                                error: userFetchErr
                                            });
                                        }
                                        const myUserID =  userFetchRes.ID;
                                        const myPhoneNumber = "'" + phoneNumber + "'";
                                        const myCurrency = "'" +  currency + "'"
                                        const myAddress = "'" + address + "'";
                                        let myAmount = amount;
                                        if(currency === 'BTC'){
                                            myAmount = amount - btcFee
                                        }else{
                                            myAmount = amount - usdtFee
                                        }
                                        
                                        let finalAmount = myAmount;
                                        let finalUSDTFee = usdtFee;
                                        let finalBTCFee = btcFee;

                                        
                                        
                                        //-------------------------------------------------------------------------------
                                        //insert details of transfer into db
                                        if(currency === 'BTC'){
                                            //Creating Timestamp
                                            const currentDate = new Date();
                                            const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);

                                            insertTransaction(myUserID, phoneNumber, myAddress, "Non-applicable", 0,0,0, "External Transfer", myCurrency, 0, btcFee, '-' + amount, 0, formattedDate);
                                            insertWalletTransaction(myUserID, myAddress, myCurrency, finalAmount,  finalBTCFee, formattedDate);
                                        }else{
                                            //Creating Timestamp
                                            const currentDate = new Date();
                                            const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 23);
                                            
                                            insertTransaction(myUserID, phoneNumber, myAddress, "Non-applicable", 0,0,0, "External Transfer", myCurrency, 0, usdtFee, 0, '-' + amount, formattedDate); 
                                            insertWalletTransaction(myUserID, myAddress, myCurrency, finalAmount, finalUSDTFee, formattedDate);
                                        }

                                        res.status(201).send({
                                            status: 'Created',
                                            result: 'Successfully Sent cryptocurrency'
                                        });
                                    });//end-fetchUserID
                                }//end-else
                            });//end-checkBalance
                        }else{
                            return res.status(403).send({
                                status: 'Forbidden',
                                pinError: 'Incorrect Pin.'
                            });
                        }
                    });//end-fetchPin
                }//end-if
            }//end-else
        });//end-checkUser
    }//end-else
}

//-------------------------------------------------------------------------
// End of dashboardController.js
//-------------------------------------------------------------------------
