$(document).ready(function(){

    chrome.storage.sync.get('options', function(val) {
        if(!val.options)
        {
            document.location = chrome.extension.getURL("options.html");
        }
        else
        {
            var options = val.options;
            chrome.tabs.getSelected(null, function(tab){
                $.ajax({
                    type: 'POST',
                    url: options.url + '/surlapi/surl',
                    data: {url: tab.url, auth: options.password},
                    error: function()
                    {
                        $('#status').html('ERROR');
                    },
                    success: function(response)
                    {
                        try
                        {
                            $json_response = response;
                            $("#url").val($json_response.link);
                            //Copy to clipboard
                            $('#url').select();
                            document.execCommand("Copy");
                            $('#status').html('Copied to clipbard');
                        }
                        catch(e)
                        {
                            $('#status').html(e.message);
                        }
                    }
                })
            });
        }
    });
});