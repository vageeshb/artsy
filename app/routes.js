// app/routes.js
// Loading pre-requisites
var blogRoutes  = require('./routes/blog.js')
  , path        = require('path');

module.exports = function(app, passport) {
  
  // Home Page
  app.get('/', function(req, res) {
    //res.render('home.jade'); // Load the index page
    res.redirect('/blog');
  });

  // ============================================
  // LOGIN
  // ============================================
  
  // Login Page
  app.get('/login', function(req, res) {

    // Render the login page and pass flash
    res.locals.messages = req.flash();
    res.render('users/login.jade');
  
  });

  // Process the login form
  app.post('/login', passport.authenticate('login', {
    successRedirect : '/profile', // Authentication successful
    failureRedirect : '/login',   // Authentication failure
    failureFlash    : true        // Show flash in failure
  }));

  // ============================================
  // SIGNUP
  // ============================================
  /*
  // Sign up page
  app.get('/signup', function(req, res) {

    // Render the sign up page
    res.render('users/signup.jade', { message: req.flash('signupMessage') });

  });

  // Process the signup form
  app.post('/signup', passport.authenticate('signup', {
    successRedirect : '/profile', // Authentication successful
    failureRedirect : '/signup',  // Authentication failure
    failureFlash    : true        // Show flash in failure
  }));
  */
  // ============================================
  // PROFILE
  // ============================================

  // User Profile Page
  app.get('/profile', isLoggedIn, function(req, res) {
    
    // Render the logged in user profile
    res.render('users/profile.jade', {
      user: req.user      // Extract user from request and return
    });

  });
  
  // ============================================
  // LOGOUT
  // ============================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  // ============================================
  // BLOG Routes
  // ============================================
  // Index
  app.get('/blog', blogRoutes.index);

  // New blog post
  app.get('/blog/new', blogRoutes.new);

  // Create blog post
  app.post('/blog/create', blogRoutes.create);

  // Edit Blog
  app.get('/blog/:id/edit', blogRoutes.edit);
  // Update Blog
  app.post('/blog/:id/update', blogRoutes.update);

  // Delte blog post
  app.get('/blog/:id/delete', blogRoutes.delete);

  // Show Blog
  app.get('/blog/:title', blogRoutes.show);

  // Image paths
  app.get('/:image_name.png', function (req, res) {
    var image_name = req.params.image_name;
    res.sendfile(path.resolve('./public/img/' + image_name + '.png'));
  });

  app.get('*', function(req, res) {
    res.redirect('/');
  });
};

// Route middleware for verifying logged in user
function isLoggedIn(req, res, next) {

  // If user is authenticated, carry on
  if(req.isAuthenticated())
    return next();

  // Else redirect to home page
  res.redirect('/');

}