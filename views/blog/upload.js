function s3_upload(object_name, dom_selecter, source){
    var s3upload = new S3Upload({
        s3_object_name: object_name,
        file_dom_selector: dom_selecter,
        s3_sign_put_url: '/sign_s3',
        onProgress: function(percent, message) {
            $('#' + dom_selecter + 'Status div').attr('style', 'width: '+percent+'%;');
        },
        onFinishS3Put: function(public_url) {
            var message = 'File uploaded successfully! Image url is: <code>' + public_url + '</code>';
            $('#' + dom_selecter + 'Url').append(message);
            if(source!=undefined) {
                $('#'+source).val(public_url);
            }
        },
        onError: function(status) {
            var message = '<div>' + status + '</div>';
            $('#' + dom_selecter + 'Url').append(message);
        }
    });
}
function uploadImage(inputHandle, source) {
    var object_name = Math.floor((Math.random()*Math.pow(100,3))+1);
    $('#' + inputHandle.id + 'Status').removeClass('hidden');
    s3_upload(object_name, inputHandle.id, source);
    $('#' + inputHandle.id + 'Url').removeClass('hidden');
}
$(document).ready(function() {
    $('#addPostImages').click(function() {
        var imageUpload = 'blogImage' + Math.floor((Math.random()*Math.pow(100,3))+1);
        var newElement = '<div><code><strong>Note:</strong> You can select multiple files</code></div><div id="' + imageUpload + 'Status" class="progress hidden"><div class="progress-bar" style="width: 0%;" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar"></div></div><input id="' + imageUpload + '" type="file" multiple /><div class="text-center"><div id="' + imageUpload + 'Url" class="hidden"></div><button class="btn btn-sm btn-primary" type="button" onclick="uploadImage(' + imageUpload + ') " title="Upload File(s)"><span class=" fa fa-upload"></span> Upload Image(s)</button></div>';
        $('#postImages').append(newElement);
        $(this).hide();
    });
});