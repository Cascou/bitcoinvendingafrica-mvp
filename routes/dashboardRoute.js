//-------------------------------------------------------------------------
// Start of dashboardRoute.js -- Responsible for creating routes, and calling respective controller functions for dashboard.
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Importing all necessary NPM packages/libraries
const { Router } = require('express');
const jwt = require('jsonwebtoken');

//-------------------------------------------------------------------------
// Importing all libraries necessary
const dashboardController = require('../controller/dashboardController');
const fetchWalletBeneficiary =  require('../utils/functions/database/scripts/fetchWalletBeneficiary');
const fetchMobileBeneficiary = require('../utils/functions/database/scripts/fetchMobileBeneficiary');
const fetchUserID = require('../utils/functions/database/scripts/fetchUserID');
const {jwtSecret} = require('../utils/api/constantVariables/variables');
const {requireAuth, getUser, nocache} = require('../middleware/authMiddleware');



//-------------------------------------------------------------------------
// Initializing all Router Functions
const router = Router();

router.get('/dashboard',requireAuth, nocache, dashboardController.dashboard_get);
router.get('/balance',requireAuth, getUser, nocache, dashboardController.balance_get);
router.post('/balance', dashboardController.balance_post);
router.get('/buy',requireAuth, getUser, nocache, dashboardController.buy_get);
router.post('/buy', dashboardController.buy_post);
router.get('/sell', requireAuth, getUser, nocache, dashboardController.sell_get);
router.post('/sell', dashboardController.sell_post);
router.get('/beneficiary',requireAuth, getUser, nocache,  function(req, res){
    
    const token =  req.cookies.jwt;

    jwt.verify(token, jwtSecret, (err, decodedToken) => {

        fetchUserID(decodedToken.number, (fetchErr, fetchRes)=>{
            if(fetchErr){
                console.log(fetchErr);
            }else{
                fetchWalletBeneficiary(fetchRes.ID ,(walletErr, walletRes)=>{
                    fetchMobileBeneficiary(fetchRes.ID, (mobileErr, mobileRes)=>{
                        res.render('beneficiary',{walletData: walletRes, mobileData: mobileRes});
                    });
                });
            }
        });
    });
});
router.get('/editWalletBeneficiary', requireAuth, getUser, nocache, function(req,res){

    const beneficiaryName = req.query.beneficiaryName;

    res.render('editWalletBeneficiary', {beneficiaryName: beneficiaryName});
   
});
router.post('/editWalletBeneficiary', dashboardController.editWalletBeneficiary_post);
router.get('/addWalletBeneficiary', requireAuth, getUser, nocache, dashboardController.addWalletBeneficiary_get);
router.get('/editMobileBeneficiary', requireAuth, getUser, nocache, function(req,res){

    const beneficiaryName = req.query.beneficiaryName;

    res.render('editMobileBeneficiary', {beneficiaryName: beneficiaryName});
   
});
router.post('/editMobileBeneficiary', dashboardController.editMobileBeneficiary_post);
router.post('/addWalletBeneficiary', dashboardController.addWalletBeneficiary_post);
router.get('/addMobileBeneficiary', requireAuth, getUser, nocache, dashboardController.addMobileBeneficiary_get);
router.post('/addMobileBeneficiary', dashboardController.addMobileBeneficiary_post);
router.get('/sendMobileBeneficiary',requireAuth, getUser, nocache, function(req,res){

    const beneficiaryName = req.query.beneficiaryName;

    res.render('sendMobileBeneficiary', {beneficiaryName: beneficiaryName});
   
});
router.post('/sendMobileBeneficiary', dashboardController.sendMobileBeneficiary_post);
router.get('/sendWalletBeneficiary',requireAuth, getUser, nocache, function(req,res){

    const beneficiaryName = req.query.beneficiaryName;

    res.render('sendWalletBeneficiary', {beneficiaryName: beneficiaryName});
   
});
router.post('/sendWalletBeneficiary', dashboardController.sendWalletBeneficiary_post);
//-------------------------------------------------------------------------
// Exporting router routes
module.exports = router;

//-------------------------------------------------------------------------
// End of dashboardRoute.js 
//-------------------------------------------------------------------------