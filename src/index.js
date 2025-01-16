//-----------------------------------------------------------------
// Start of index.js -- Responsible for express side of application
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
// Initializing all libraries
const authRoutes = require('../routes/authRoute');
const verifyRoute = require('../routes/verifyRoute');
const dashboardRoute = require('../routes/dashboardRoute');
const storageRoute = require('../routes/storageRoute');

//-----------------------------------------------------------------
// Initializing express -- to setup server details
const app = express();
//-----------------------------------------------------------------
//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const port = process.env.port || 3000;

//-----------------------------------------------------------------
//setup handlebars engine and view location
app.set('view engine', 'ejs');//setup handlebars
app.set('views', viewsPath);

//-----------------------------------------------------------------
//setup static directory to serve --middleware
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(cookieParser());

//-----------------------------------------------------------------
// Calling Routes
app.use(authRoutes);
app.use(verifyRoute);
app.use(dashboardRoute);
app.use(storageRoute);

//-----------------------------------------------------------------
// Default Page
app.get('/', (req, res) =>{
    res.render('home');
});

//-----------------------------------------------------------------
// Home Page
app.get('/home', (req, res) =>{
    res.render('home');
});

//-----------------------------------------------------------------
// NOT FOUND PAGES
//-----------------------------------------------------------------
// Not Found Page
app.get('*', (req, res) =>{
    res.render('NotFound');
});

//-----------------------------------------------------------------
// Port Listen Method.
app.listen(port, () =>{
    console.log('Server is running on port ' + port);
});


//-----------------------------------------------------------------
// End of index.js
//-----------------------------------------------------------------
