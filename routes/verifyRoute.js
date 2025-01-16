//-------------------------------------------------------------------------
// Start of verifyRoute.js -- Responsible for creating routes, and calling respective controller functions for Twilio verification.
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Importing all necessary NPM packages/libraries
const { Router } = require('express');

//-------------------------------------------------------------------------
// Importing all libraries necessary
const verifyController = require('../controller/verifyController');

//-------------------------------------------------------------------------
// Initializing all Router Functions
const router = Router();

router.get('/sendVerification',verifyController.verify_get);

//-------------------------------------------------------------------------
// Exporting router routes
module.exports = router;

//-------------------------------------------------------------------------
// End of verifyRoute.js 
//-------------------------------------------------------------------------