$(document).ready( function() {
	$('#myPreview').click(function(){
		$.ajax({
			url: '/blog/preview',
			data: {
				content: $('#blogContent').val()
			},
			type: 'POST'
		})
			.success(function(content) {
				$('#previewContent').empty();
				$('#previewContent').append(content);
			});
	});
	$('#help').click(function(){
		$.ajax({
			url: '/markdownhelp',
			type: 'GET'
		})
			.success(function(content) {
				$('#helpContent').empty();
				$('#helpContent').append(content);
			});
	});
});