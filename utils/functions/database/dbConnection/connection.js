//-----------------------------------------------------------------
// Start of connection.js -- Responsible for holding values of connection to Azure SQl db
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing necessary library packages
const {azureServer, userName, password, database} = require('../../../api/constantVariables/variables');

//-----------------------------------------------------------------
// Creating Config Object
var config = {  
    server: azureServer,
    authentication: {
        type: 'default',
        options: {
            userName: userName,
            password: password 
        }
    },
    options: {
        // Microsoft Azure, needs encryption
        encrypt: true,
        database: database
    }
};

//-----------------------------------------------------------------
// Exporting connection object config
module.exports = {config};

//-----------------------------------------------------------------
// End of connection.js
//-----------------------------------------------------------------
