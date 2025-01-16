//-------------------------------------------------------------------------
// Start of authMiddleware.js -- Responsible for checking JWT in cookies when pages are called
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Importing all npm packages necessary
const jwt = require('jsonwebtoken');

//-------------------------------------------------------------------------
// Importing all libraries necessary
const {jwtSecret} = require('../utils/api/constantVariables/variables');

//-------------------------------------------------------------------------
// requireAuth Method
const requireAuth = (req, res, next) =>{

    const token = req.cookies.jwt;

    //check if jwt token exists & is verified
    if(token){
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                res.redirect('/login');
            }else{
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}

//-------------------------------------------------------------------------
//check current user
const getUser = (req, res, next) => {

    const token =  req.cookies.jwt;

    if(token){
        jwt.verify(token, jwtSecret, (err, decodedToken) =>{
            if(err){
                res.locals.phoneNumber = null;
                next();
            }else{
                res.locals.phoneNumber = decodedToken.number;
                next();
            }
        });
    }else{
        res.locals.phoneNumber = null;
        next();
    }
}

//-------------------------------------------------------------------------
//Clear cache method, to ensure users cant go back to certain pages, when logged in
const nocache = (req,res,next)=>{
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

//-------------------------------------------------------------------------
// Exporting Methods
module.exports = {requireAuth, getUser, nocache};

//-------------------------------------------------------------------------
// End of authMiddleware.js 
//-------------------------------------------------------------------------
