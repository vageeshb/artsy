$(document).ready(function(){
	$(".user-post").click(function() {
		window.location.href="http://artsyvb.herokuapp.com/blog/"+$(this).attr("name")
	});
});