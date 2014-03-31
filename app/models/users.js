// app/models/user.js

// Loading prerequisites
var mongoose = require('mongoose')
	, bcrypt = require('bcrypt-nodejs');

// Define User Schema
var userSchema = mongoose.Schema({
  name        : String,
	email				: String,
	password		: String,
  role        : String
});

// User Methods
// Generate Hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Verifying password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// Create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
