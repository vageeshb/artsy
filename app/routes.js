// app/routes.js
// Loading pre-requisites
var blogRoutes  = require('./routes/blog.js')
  , userRoutes  = require('./routes/user.js')
  , path        = require('path')
  , crypto      = require('crypto')
// AWS S3 File Uploading Config
  , AWS_ACCESS_KEY  = 'AKIAJYNTOGEHYG2PSKOA'
  , AWS_SECRET_KEY  = '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'
  , S3_BUCKET       = 'artsyvb';

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
  app.get('/profile', isLoggedIn, userRoutes.profile);
  
  // User Public Profile Page
  app.get('/user/:name', userRoutes.show);

  // Edit Profile Page
  app.get('/profile/edit', isLoggedIn, userRoutes.edit);

  // Update Profile
  app.post('/profile/edit', isLoggedIn, userRoutes.update);

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
  app.get('/blog/new', isLoggedIn, blogRoutes.new);

  // Create blog post
  app.post('/blog/create', isLoggedIn, blogRoutes.create);

  // Edit Blog
  app.get('/blog/:id/edit', isLoggedIn, blogRoutes.edit);
  app.post('/blog/preview', isLoggedIn, blogRoutes.preview);
  // Update Blog
  app.post('/blog/:id/update', isLoggedIn, blogRoutes.update);

  // Delte blog post
  app.get('/blog/:id/delete', isLoggedIn, blogRoutes.delete);

  // Publish blog post
  app.get('/blog/:id/publish', isLoggedIn, blogRoutes.publish);

  // Unpublish blog post
  app.get('/blog/:id/unpublish', isLoggedIn, blogRoutes.unpublish);
  // Add Comment to blog post
  app.post('/blog/addComment', blogRoutes.addComment);
  // Delete comment on blog post
  app.get('/blog/:blogId/delComment/:commentId', blogRoutes.delComment);
  // Show Blog
  app.get('/blog/:title', blogRoutes.show);

  // AWS Image Path
  app.get('/sign_s3', function(req, res){
    var object_name = req.query.s3_object_name;
    var mime_type = req.query.s3_object_type;

    var now = new Date();
    var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:public-read";

    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/artsyvb/"+object_name;

    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
    signature = encodeURIComponent(signature.trim());
    signature = signature.replace('%2B','+');

    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;
    console.log(url);
    var credentials = {
        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
        url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();
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