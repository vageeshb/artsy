// app/routes/blog.js
// Loading prerequisites
var Blog 	= require('../models/blog.js')
	, flash = require('connect-flash')
	, path 	= require('path')
	, fs 		= require('fs')
	, hljs  = require('highlight.js')
	, md 		= require('marked').setOptions({
							highlight: function (code) {
								return hljs.highlightAuto(code).value;
							}
						});

// Exposing the routes for blog

// INDEX Route
exports.index = function(req, res) {
	Blog.find({"isPublished" : "true"}).sort({published: -1}).exec(function(err, blogs) {
		if(err) throw err;
		res.locals.messages = req.flash();
		res.render('blog/home', {
			title 	: 'Blog',
			blogs 	: blogs,
			user 		: req.user
		});	
	});
}

// Blog Post Show Route
exports.show = function(req, res) {
	var title = req.params.title;
	Blog.findOne({'title' : title, isPublished: true}, function(err, blog) {
		if(err) {
			req.flash('danger','Woops, looks like the blog post you are looking for does not exist!');
			res.redirect('/blog');
		}
		if(!blog) {
			req.flash('danger','Woops, looks like the blog post you are looking for does not exist!');
			res.redirect('/blog');
		} else {
			res.render('blog/show', {
				title	: blog.title,
				blog 	: blog,
				md 		: md,
				user 	: req.user
			});
		 }
	});
}

// Create Blog Post Route
exports.create = function(req, res) {
	// Creating Blog object
	var newBlog 				= new Blog();
	newBlog.title 			= req.body.title;
	newBlog.content			= req.body.content;
	newBlog.summary			= req.body.summary;
	newBlog.published		= new Date();
	newBlog.author 			= req.user.name;
	newBlog.tags 				= req.body.tags.split(',');
	newBlog.imageUrl		= req.body.blogImageUrl;
	newBlog.isPublished 	= false;
	newBlog.save(function(err) {
		if(err) throw err;
		res.redirect('/blog/' + newBlog.title);
	});
}

// Blog Post Edit Route
exports.edit = function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if(err) throw err;
		// Sending markdown for preview
		res.render('blog/edit', {
			title	: blog.title,
			blog 	: blog,
			md 		: md,
			user 	: req.user
		});
	});
}

// Blog Post Update Route
exports.update = function(req, res) {
	Blog.findByIdAndUpdate(req.params.id, {
		title 		:  	req.body.title,
		content		: 	req.body.content,
		summary		: 	req.body.summary,
		tags			: 	req.body.tags.split(',')
	}, function(err, data) {
		if(err) throw err;
		console.log('Blog updated');
		res.redirect('/blog/' + req.body.title);
	});
}

// New Blog Post Route
exports.new = function(req, res) {
	res.render('blog/new', {
		title: 'New Blog Post',
		user: req.user
	});
}

// Delete Blog Post Route
exports.delete = function(req, res) {
	// Getting Blog Id
	var blogId = req.params.id;
	Blog.findByIdAndRemove(blogId, function(err, data) {
		if(err) throw err;
		var imagePath = path.resolve('./public/img/' + data.title + '.png');
		fs.unlink(imagePath, function (err){
			if(err)
				console.log('Could not find the image');
			console.log('Blog title image was deleted');
		});
		res.redirect('/blog');
	});
}

// Publish Blog Post
exports.publish = function(req, res) {
	var blogId = req.params.id;
	Blog.findByIdAndUpdate(blogId, { isPublished : true }, function(err) {
		if(err) throw err;
		res.redirect('/profile');
	});
}

// Publish Blog Post
exports.unpublish = function(req, res) {
	var blogId = req.params.id;
	Blog.findByIdAndUpdate(blogId, { isPublished : false }, function(err) {
		if(err) throw err;
		res.redirect('/profile');
	});
}

// Preview blog post
exports.preview = function(req, res) {
	var content = md(req.body.content);
	res.send(content);
}

// Add Comment
exports.addComment = function(req, res) {
	var comment = {
		owner 	: req.body.commentOwner,
		content : req.body.commentContent,
		posted 	: new Date()
	};
	var blogId = req.body.blogId;
	Blog.findById(blogId, function(err, blog) {
		if(err)
			res.send('Woops, something went wrong while adding comment! Please try again later!');
		blog.comments.push(comment);
		comment.id = blog.comments[blog.comments.length-1].id;
		blog.save(function(err, blog) {
			if(err) 
				res.send('Woops, something went wrong while adding comment! Please try again later!');
			comment.posted = comment.posted.toDateString();
			res.send(comment);
		});
	});
}

// Delete Comment
exports.delComment = function(req, res) {
	var blogId = req.params.blogId;
	var commentId = req.params.commentId;
	Blog.findById(blogId, function(err, blog) {
		if(err) throw err;
		for (var i = 0; i < blog.comments.length; i++) {
			if(blog.comments[i].id === commentId)
				var index = i;
		};
		if(index>-1) {
			blog.comments.splice(index,1);
			blog.save(function(err) {
				if(err)
					res.render('404');
				res.redirect('/blog/' + blog.title);
			});
		}
	});
}