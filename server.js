// server.js

// Set Up =======================================
var express = require('express')
  , app = express()
  , port = process.env.PORT || 8080
  , mongoose = require('mongoose')
  , passport = require('passport')
  , flash = require('connect-flash')
  , path = require('path')
  , sass = require('node-sass');

var configDB = require('./config/database.js');

// Configuration ================================
// DB Connection
mongoose.connect(configDB.url);

// Passport Config
require('./config/passport.js')(passport);

// Application Config
app.configure(function() {

  // set up the express application
  app.use(express.logger('dev')); // log every request to the console
  app.use(express.cookieParser()); // Cookies (Needed for authorization)
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.set('view engine', 'jade'); // Jade templating engine

  // required for passport
  app.use(express.session({ secret: 'artsyVageesh' })); // Secret Session
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // Using flash messages stored in sessions
  
  // Stylesheets
  app.use(
    sass.middleware({
      src: __dirname + '/sass',
      dest: __dirname + '/public',
      outputStyle: 'compressed',
      debug: true
    })
  );
  
  app.use(express.static(path.join(__dirname, 'public'))); //Serve stylesheets
  
});

// Routes ======================================================================
// Load our routes
require('./app/routes.js')(app, passport); 

// Launch ======================================================================
app.listen(port, function() {
  console.log('Server is up and listening to: ' + port);
});