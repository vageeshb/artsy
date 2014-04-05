$(document).ready(function() {
	var blogId = $('.article').attr('id');
 	$(window).scroll(function() {
		var offset = $(window).scrollTop();
		offset     = offset * 20;
		$('#social-links a span').css({
			'-moz-transform': 'rotate(' + offset + 'deg)',
			'-webkit-transform': 'rotate(' + offset + 'deg)',
			'-o-transform': 'rotate(' + offset + 'deg)',
			'-ms-transform': 'rotate(' + offset + 'deg)',
			'transform': 'rotate(' + offset + 'deg)',
		});
	});
	$('#submitComment').click(function() {
		if($('#commentOwner').val()!='' && $('#commentContent').val()!='') {
			$.ajax({
				url 	: '/blog/addComment',
				type 	: 'POST',
				data 	: {
					blogId 					: blogId,
					commentOwner  	: $('#commentOwner').val(),
					commentContent 	: $('#commentContent').val()
				}
			})
				.success(function(comment){
					$('#closeModal').click();
					$('#noComment').remove();
					var newComment = '<div class="comments"><div class="comment-meta"><span><a>' + comment.owner + '</a></span><span> commented on </span><span><a>' + comment.posted + '</a></span></div><div class="content">' + comment.content + '</div>'
					newComment += '</div></div></div>';
					$('#commentSection').prepend(newComment);
				})
				.error(function(message) {
					alert(message);
				});
		}	else {
			alert('Comment owner and content are required!');
		}
	});
});