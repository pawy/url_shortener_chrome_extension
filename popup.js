$(document).ready(function(){

    if(!localStorage["options_url"])
    {
        document.location = chrome.extension.getURL("options.html");
    }
    else
    {
        var pw = localStorage["options_password"];
        chrome.tabs.getSelected(null, function(tab){
            $.ajax({
                type: 'POST',
                url: localStorage["options_url"],
                data: {APICreate: tab.url, authKey: pw},
                error: function()
                {
                    $('#status').html('ERROR');
                },
                success: function(response)
                {
                    try
                    {
                        $json_response = response;
                        $("#url").val($json_response.shortenedLink);
                        //Copy to clipboard
                        $('#url').select();
                        document.execCommand("Copy");
                        $('#status').html('Copied to clipboard');
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
