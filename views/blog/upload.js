function s3_upload(object_name){
    var s3upload = new S3Upload({
        s3_object_name: object_name,
        file_dom_selector: 'files',
        s3_sign_put_url: '/sign_s3',
        onProgress: function(percent, message) {
            $('#status div').attr('style', 'width: '+percent+'%;');
        },
        onFinishS3Put: function(public_url) {
            $('#blogImageUrl').val(public_url);
        },
        onError: function(status) {
            $('#status').html('Upload error: ' + status);
        }
    });
}
/*
* Listen for file selection:
*/
$(document).ready(function() {
    $('#files').on('change', function() {
        var object_name = Math.floor((Math.random()*Math.pow(100,3))+1);
        $('#blogImageUrl').val('https://artsyvb.s3.amazonaws.com/'+object_name);
        s3_upload(object_name);
    });
});