function save_options() {

    var url = $('#url').val();
    $status = $('#status');
    resetStatus();

    //Test the url shortener service
    $status.html('testing the service...');
    $.ajax({
        type: 'GET',
        url: url + '/surlapi/version',
        error: function()
        {
            showError();
        },
        success: function(response)
        {
            try
            {
                $json_response = response;
                if($json_response.V >= 2)
                {
                    $status.html('encrypting the password...');
                    $.ajax({
                        type: 'GET',
                        url: url + '/surlapi/md5/' + $('#password').val(),
                        error: function()
                        {
                            showError();
                        },
                        success: function(response)
                        {
                            try
                            {
                                chrome.storage.sync.get('options', function(val) {
                                    var options = val.options;

                                    //check if the password has changed
                                    var pw = options && $('#password').val() != options.password ? response.md5 : $('#password').val();
                                    //use chrome sync storage
                                    var options = {
                                        url: url,
                                        password: pw
                                    };
                                    chrome.storage.sync.set({'options': options}, function() {
                                        $status.html('changes saved!');
                                        hideStatus();
                                    });
                                });
                            }
                            catch(e)
                            {
                                showError();
                            }
                        }
                    });
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
    chrome.storage.sync.get('options', function(val) {
        var options = val.options;
        if (!options.url) return;
        $('#url').val(options.url);
        if (!options.password) return;
        $('#password').val(options.password);
    });
}

function resetStatus()
{
    //Reset message
    $status.addClass('alert-info');
    $status.removeClass('alert-danger');
    $status.fadeIn('slow');
}

function hideStatus()
{
    setTimeout(function() {
        $status.fadeOut('slow');
    }, 2000);
}

$(document).ready(function(){

    restore_options();

    $('form').submit(function(event){
        save_options();
        event.preventDefault();
    });

    $('#surlbz').click(function(){
       $('#url').val("http://surl.bz");
    });

    $('#md5').click(function(event){
        event.preventDefault();

        //use the surlapi/md5
        var url = $('#url').val();
        $status = $('#status');
        resetStatus();

        //Test the url shortener service
        $status.html('using the api to encrypt...');

        $.ajax({
            type: 'GET',
            url: url + '/surlapi/md5/' + $('#password').val(),
            error: function()
            {
                showError();
            },
            success: function(response)
            {
                try
                {
                    $status.html('encrypted with md5');
                    $('#password').val(response.md5);
                    hideStatus();
                }
                catch(e)
                {
                    showError();
                }
            }
        });
    });
});