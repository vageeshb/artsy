$(document).ready(function(){
	$(".blog-post").click(function() {
		window.location.href="/blog/"+$(this).attr("title")
	});
});