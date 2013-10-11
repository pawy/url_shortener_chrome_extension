function save_options() {

    var url = $('#url').val();
    $status = $('#status');

    //Reset message
    $status.addClass('alert-info');
    $status.removeClass('alert-danger');
    $status.fadeIn('slow');

    //Test the url shortener service
    $status.html('testing the service...');
    $.ajax({
        type: 'GET',
        url: url,
        data: {APIVersion: 'test'},
        error: function()
        {
            showError();
        },
        success: function(response)
        {
            try
            {
                $json_response = $.parseJSON(response);
                if($json_response.V >= 1)
                {
                    localStorage["options_url"] = url;
                    localStorage["options_password"] = $('#password').val();
                    $status.html('changes saved!');
                    setTimeout(function() {
                        $status.fadeOut('slow');
                    }, 2000);
                }
                else
                {
                    showError();
                }
            }
            catch(e)
            {
                showError();
            }

        }
    });
}

function showError()
{
    $status.removeClass('alert-info');
    $status.addClass('alert-danger');
    $status.html('ERROR: The given url is not a valid url shortener service.');
    setTimeout(function() {
        $status.fadeOut('slow');
    }, 2000);
}

function restore_options() {
    $('#status').hide();

    var url = localStorage["options_url"];
    if (!url) return;
    $('#url').val(url);

    var pw = localStorage["options_password"];
    if (!pw) return;
    $('#password').val(pw);
}

$(document).ready(function(){

    restore_options();

    $('form').submit(function(event){
        save_options();
        event.preventDefault();
    });

    $('#doubleu').click(function(){
       $('#url').val("http://doubleu.ch");
    });
});