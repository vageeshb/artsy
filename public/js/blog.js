$(document).ready(function(){
	$(".blog-post").click(function() {
		window.location.href="http://localhost:8080/blog/"+$(this).attr("title")
	});
});