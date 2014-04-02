// app/routes/user.js
// Loading prerequisites
var User 	= require('../models/users.js')
	, Blog 	= require('../models/blog.js')
	, flash = require('connect-flash')
	, md 		= require('marked');

module.exports = {

	// Profile Page
	profile : function(req, res) {
		Blog.find({ author : req.user.name }, function(err, blogs) {
			if(err) throw err;
			res.render('users/profile', {
				user 	: 	req.user,
				blogs : 	blogs
			});	
		});
		
	},

	// Edit User Details
	edit : function(req, res) {
		res.locals.messages = req.flash();
		res.render('users/edit', {
			user 	: 	req.user
		});
	},

	// Save Updated User Details
	update : function(req, res) {
		var updtUser = req.body;
		console.log(updtUser);
		User.findById(updtUser.userId, function(err, user) {
			if(err) throw err;
			// Verify if new password was submitted
			if(updtUser.newPassword!='') {
				// Verify that old password matches
				if(!user.validPassword(updtUser.oldPassword)) {
					req.flash('danger', 'Incorrect Password!');
					res.redirect('/profile/edit');
				} else {
					// Password matched, set new password
					user.password = user.generateHash(updtUser.newPassword);
				}
			}
			// Set Bio if it is not empty
			user.bio = ((updtUser.bio != '') ? updtUser.bio : user.bio);
			user.save(function(err) {
				if(err) throw err;
				req.flash('success', 'Profile Updated Successfully!');
				res.redirect('/profile/edit');
			});
		});
	},

	// Show User Public Profile
	show : function(req, res) {
		var userName = req.params.name;
		User.findOne({ name: userName }, function(err, user) {
			if(err) throw err;
			if(!user) {
				req.flash('danger', 'Woops, No user profile found for user: ' + req.params.name);
				res.redirect('/');
			} else {
				Blog.find({author: userName}, function(err, blogs) {
					if(err) throw err;
					res.render('users/show', {
						userProfile 	: 	user,
						blogs 				: 	blogs,
						md 						: 	md
					});	
				});
			}
		});
	}

};