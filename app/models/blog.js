// app/models/blog.js

// Loading prerequisites
var mongoose = require('mongoose')
	;

// Define the Blog Post schema
var blogSchema = mongoose.Schema({
	title				: { type: String, required: true},
	content			: { type: String, required: true},
	summary			: { type: String, required: true},
	author			: { type: String, required: true},
	imageUrl 		: { type: String},
	tags				: [],
	published		: Date,
	isPublished : Boolean
});

// Create the model for blog and expose it to the app
module.exports = mongoose.model('Blog', blogSchema);