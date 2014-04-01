// app/routes/user.js
// Loading prerequisites
var User 	= require('../models/users.js')
	, Blog 	= require('../models/blog.js')
	, flash = require('connect-flash');

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
		User.findById(updtUser.userId, function(err, user) {
			if(err) throw err;
			if(!user.validPassword(updtUser.oldPassword)) {
				req.flash('danger', 'Incorrect Password!');
				res.redirect('/profile/edit');
			} else {
				user.name 		= updtUser.name;
				user.email 		= updtUser.email;
				user.password = user.generateHash(updtUser.newPassword);
				user.save(function(err) {
					if(err) throw err;
					req.flash('success', 'Profile Updated Successfully!');
					res.redirect('/profile/edit');
				})
			}
		});
	}

};