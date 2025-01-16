//-------------------------------------------------------------------------
// Start of storageRoute.js -- Responsible for creating routes, to set specific variables to localStorage.
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Importing all necessary NPM packages/libraries
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//-------------------------------------------------------------------------
//Importing all necessary scripts
const checkBalance = require('../utils/functions/database/scripts/checkBalance');
const marketSummary =require('../utils/api/marketSummary');
const marketSummaryUSDT = require('../utils/api/marketSummaryUSDT');
const fetchUserID = require('../utils/functions/database/scripts/fetchUserID');
const fetchSpecificWalletBeneficiary = require('../utils/functions/database/scripts/fetchSpecificWalletBeneficiary');
const fetchSpecificMobileBeneficiary = require('../utils/functions/database/scripts/fetchSpecificMobileBeneficiary');
const deleteWalletBeneficiary =  require('../utils/functions/database/scripts/deleteWalletBeneficiary');
const deleteMobileBeneficiary = require('../utils/functions/database/scripts/deleteMobileBeneficiary');
const {jwtSecret, btcMinWithdrawal, btcFee, usdtFee, usdtMinWithdrawal} = require('../utils/api/constantVariables/variables');

//-------------------------------------------------------------------------
// Initializing all Router Functions
const router = Router();

//-------------------------------------------------------------------------
// Get Balance of user when page loads
router.get('/getBalance', function(req, res){
    
    const token =  req.cookies.jwt;

    if(token){
        jwt.verify(token, jwtSecret, (err, decodedToken) =>{
            if(err){
                console.log(err)
            }else{
                checkBalance(decodedToken.number, (balanceErr, balanceRes)=>{
                    if(balanceErr){
                        console.log(balanceErr);
                    }
                                    
                    res.json({
                        btcBalance: balanceRes.btc,
                        usdtBalance: balanceRes.usdt
                    })
                });
            }
        });
    }
});

//-------------------------------------------------------------------------
// Gets market Summary
router.get('/getSummary', function(req, res){

    marketSummary((marketErr, marketRes)=>{
        if(marketErr){
            console.log(marketErr);
        }else{
            marketSummaryUSDT((marketUSDTErr, marketUSDTRes)=>{
                if(marketUSDTErr){
                    console.log(marketUSDTErr)
                }else{
                    res.json({
                        btcPrice: marketRes.btc,
                        usdtPrice: marketUSDTRes.usdt
                    });
                }
            });
        }
    });
});


//-------------------------------------------------------------------------
// Gets getInfo Summary
router.get('/getInfo', function(req, res){
    res.json({
        minimumBTC: btcMinWithdrawal,
        btcFee: btcFee,
        minimumUSDT: usdtMinWithdrawal,
        usdtFee: usdtFee
    });
});


//-------------------------------------------------------------------------
// Gets the wallet beneficiary associated with the ID
router.get('/getWalletBeneficiary/:ID', function(req, res){

    const ID = req.params.ID; // Access the parameter value from the request
    const token =  req.cookies.jwt;

    jwt.verify(token, jwtSecret, (err, decodedToken) => {

        fetchUserID(decodedToken.number, (fetchIDErr, fetchIDRes)=>{
            if(fetchIDErr){
                console.log(fetchErr);
            }else{
                fetchSpecificWalletBeneficiary(ID,fetchIDRes.ID, (fetchErr, fetchRes)=>{
                    res.json({
                        beneficiaryName: fetchRes.data[0].beneficiaryName,
                        beneficiaryAddress: fetchRes.data[0].walletAddress,
                        currency: fetchRes.data[0].currency
                    });
                });  
            }
        });
    });
});

//-------------------------------------------------------------------------
// Gets the mobile beneficiary associated with the ID
router.get('/getMobileBeneficiary/:ID', function(req, res){
   
    const ID = req.params.ID; // Access the parameter value from the request
    const token =  req.cookies.jwt;

    jwt.verify(token, jwtSecret, (err, decodedToken) => {

        fetchUserID(decodedToken.number, (fetchIDErr, fetchIDRes)=>{
            if(fetchIDErr){
                console.log(fetchErr);
            }else{
                fetchSpecificMobileBeneficiary(ID,fetchIDRes.ID, (fetchErr, fetchRes)=>{
                    res.json({
                        beneficiaryName: fetchRes.data[0].beneficiaryName,
                        beneficiaryMobile: fetchRes.data[0].mobileAddress,
                        currency: fetchRes.data[0].currency
                    });
                });  
            }
        });
    });
});

//-------------------------------------------------------------------------
// Delete Wallet Beneficiary
router.post('/deleteWalletBeneficiary/:beneficiaryID', function(req, res){

    const beneficiaryID = req.params.beneficiaryID; // Access the parameter value from the request
    const token =  req.cookies.jwt;

    jwt.verify(token, jwtSecret, (err, decodedToken) => {

        fetchUserID(decodedToken.number, (fetchIDErr, fetchIDRes)=>{
            if(fetchIDErr){
                console.log(fetchErr);
            }else{
                deleteWalletBeneficiary(fetchIDRes.ID, beneficiaryID);                               
            }
        });
    });
});

//-------------------------------------------------------------------------
// Delete Mobile Beneficiary
router.post('/deleteMobileBeneficiary/:beneficiaryID', function(req, res){

    const beneficiaryID = req.params.beneficiaryID; // Access the parameter value from the request
    const token =  req.cookies.jwt;

    jwt.verify(token, jwtSecret, (err, decodedToken) => {

        fetchUserID(decodedToken.number, (fetchIDErr, fetchIDRes)=>{
            if(fetchIDErr){
                console.log(fetchErr);
            }else{
                deleteMobileBeneficiary(fetchIDRes.ID, beneficiaryID);                               
            }
        });
    });
});



//-------------------------------------------------------------------------
// Exporting router routes
module.exports = router;

//-------------------------------------------------------------------------
// End of storageRoute.js 
//-------------------------------------------------------------------------