// app/models/blog.js

// Loading prerequisites
var mongoose = require('mongoose')
	;

// Define the comment schema
var commentSchema = mongoose.Schema({
	owner 			: { type: String, required: true},
	content 		: { type: String, required: true},
	posted 			: Date
});

// Define the Blog Post schema
var blogSchema = mongoose.Schema({
	title				: { type: String, required: true},
	content			: { type: String, required: true},
	summary			: { type: String, required: true},
	author			: { type: String, required: true},
	imageUrl 		: { type: String},
	tags				: [],
	comments 		: [commentSchema],
	published		: Date,
	isPublished : Boolean
});

// Create the model for blog and expose it to the app
module.exports = mongoose.model('Blog', blogSchema);