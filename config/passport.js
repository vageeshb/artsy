// config/passport.js

// Loading prerequisites
var LocalStrategy = require('passport-local').Strategy;

// Load User model
var User = require('../app/models/users.js');

// Exposing passport functions to our app

module.exports = function(passport) {

	// ============================================
	// PASSPORT SESSION SETUP
	// ============================================
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// ============================================
	// LOCAL SIGNUP
	// ============================================

	passport.use('signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		// asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
	    User.findOne({ 'email' :  email }, function(err, user) {
	    	console.log('Inside user search');
	      // if there are any errors, return the error
	      if (err)
	        return done(err);

	      // check to see if theres already a user with that email
	      if (user) {
	        return done(null, false, req.flash('danger', 'That email is already taken.'));
	      } 
	      else {
				  // if there is no user with that email
		      // create the user
		      var newUser            = new User();

		      // set the user's local credentials
		      newUser.email    	= email;
		      newUser.password 	= newUser.generateHash(password);
		      newUser.role			= "1";
		      console.log(newUser);
					// save the user
		      newUser.save(function(err) {
		        if (err)
		          throw err;
		        return done(null, newUser);
		      });
	      }
	    });    
  	});
  }));
	
	// Login Strategy
	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({'email' : email}, function(err, user) {
				// If there were any errors
				if(err)
					return done(err);
				// If no user was found with email
				if(!user)
					return done(null, false, req.flash('danger', 'No user found!'));
				// If password was incorrect
				if(!user.validPassword(password))
					return done(null, false, req.flash('danger', 'Invalid Password.'));
				// No validation errors, successful login
				return done(null, user);
			});
		});
	}));
};