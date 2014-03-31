// app/routes/blog.js
// Loading prerequisites
var Blog 	= require('../models/blog.js')
	, flash = require('connect-flash')
	, path 	= require('path')
  , fs 		= require('fs')
  , md 		= require('marked')
  , hljs  = require('highlight.js');

// Exposing the routes for blog

exports.index = function(req, res) {
	Blog.find({}, function(err, blogs) {
		if(err) throw err;
		res.locals.messages = req.flash();
		res.render('blog/home', {
   		title 	: 'Artsy - Blog',
   		blogs 	: blogs,
    	user 		: req.user
  	});	
	});
	//console.log(message.error);
}

exports.show = function(req, res) {
	Blog.findOne({'title' : req.params.title}, function(err, blog) {
		if(err) {
			req.flash('danger','Woops, looks like the blog post you are looking for does not exist!');
			res.redirect('/blog');
		} else {
			// Code highlighting
			md.setOptions({
	  		highlight: function (code) {
	    		return hljs.highlightAuto(code).value;
	  		}
			});
	 		res.render('blog/show', {
				title	: 'Artsy - Blog - ' + blog.title,
				blog 	: blog,
				md 		: md,
				user 	: req.user
			});
	 	}
	});
}

exports.edit = function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if(err) throw err;
 		res.render('blog/edit', {
			title	: 'Artsy - Blog - ' + blog.title,
			blog 	: blog,
			user 	: req.user
		});
	});
}

exports.update = function(req, res) {

	Blog.findByIdAndUpdate(req.params.id, {
		title 		:  	req.body.title,
	  content		: 	req.body.content,
		summary		: 	req.body.summary,
		tags			: 	req.body.tags.replace(' ','').split(',')
	}, function(err, data) {
		if(err) throw err;
		console.log('Blog updated');
		res.redirect('/blog/' + req.body.title);
	});
}

exports.new = function(req, res) {
	res.render('blog/new', {
		title: 'Artsy - Blog - New Blog Post',
		user: req.user
	});
}

exports.create = function(req, res) {
	// Creating Blog object
	var newBlog 			= new Blog();
	newBlog.title 		= req.body.title;
	newBlog.content		= req.body.content;
	newBlog.summary		= req.body.summary;
	newBlog.published	= new Date();
	newBlog.author 		= req.user.name;
	newBlog.tags 			= req.body.tags.replace(' ','').split(',');
	// Setting Path names for blog image File
	var tempPath 			= req.files.file.path
		, targetPath 		= path.resolve('./public/img/' + newBlog.title + '.png' );

	newBlog.save(function(err) {
		if(err) throw err;
		if (path.extname(req.files.file.name).toLowerCase() === '.png') {
      fs.rename(tempPath, targetPath, function(err) {
        if(err) throw err;
        res.redirect('/blog/' + newBlog.title);
      });
    } else {
      fs.unlink(tempPath, function (err) {
        if (err) throw err;
        console.error("No Files were uploaded!");
        res.redirect('/blog/' + newBlog.title);
      });
    }
	});
}

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