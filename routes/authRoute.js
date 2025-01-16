//-------------------------------------------------------------------------
// Start of authRoute.js -- Responsible for creating routes, and calling respective controller functions for authenticating users.
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Importing all necessary NPM packages/libraries
const { Router } = require('express');

//-------------------------------------------------------------------------
// Importing all libraries necessary
const authController = require('../controller/authController');

//-------------------------------------------------------------------------
// Initializing all Router Functions
const router = Router();

router.get('/register',authController.register_get);
router.post('/register', authController.register_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get)

//-------------------------------------------------------------------------
// Exporting router routes
module.exports = router;

//-------------------------------------------------------------------------
// End of authRoute.js 
//-------------------------------------------------------------------------