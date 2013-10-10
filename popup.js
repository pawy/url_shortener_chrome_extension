$(document).ready(function(){

    if(!localStorage["options_url"])
    {
        $('#status').html('<span style="color:red">ERROR:</span> Please edit the options and enter the url of your shortener service!');
    }
    else
    {
        var pw = localStorage["options_password"];
        chrome.tabs.getSelected(null, function(tab){
            $.ajax({
                type: 'GET',
                url: localStorage["options_url"],
                data: {APICreate: tab.url, authKey: pw},
                success: function(response)
                {
                    $json_response = $.parseJSON(response);
                    $("#url").val($json_response.shortenedLink);
                    //Copy to clipboard
                    $('#url').select();
                    document.execCommand("Copy");
                    $('#status').html('Copied to clipboard');
                }
            })
        });
    }
});
