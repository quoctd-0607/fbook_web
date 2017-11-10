$(document).ready(function() {
    $('.notification_onclick').on('click', function (e) {
        var notificationId = $(this).data('notification-id');
        $.ajax({
            url: API_PATH + 'notification/update/' + notificationId,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'GET',
            data: {},
        }).done(function (response) {
            if (response.message.code == 200) {
            } else {
                showNotify('danger', "Data Invalid", {icon: "glyphicon glyphicon-remove"}, {delay: 1000});
            }
        }).fail(function (error) {
            showNotify('danger', "Data Invalid", {icon: "glyphicon glyphicon-remove"}, {delay: 1000});
        });
    });
});

$(document).ready(function() {
    $('.time_a_go').each(function() {
        $(this).html(timeAGo($(this).html()));
    });
});

timeAGo = function ( date ) {
    var seconds = Math.floor(( Date.parse(new Date()) - Date.parse(date) ) / 1000 );
    interval = Math.floor( seconds / 3600 );
    if (interval > 24) {

        return date;
    }
    if (interval == 1) {

        return interval + " hour ago";
    }
    if (interval > 1) {

        return interval + " hours ago";
    }
    interval = Math.floor( seconds / 60 );
    if (interval == 1) {

        return interval + " minute ago";
    }
    if (interval > 1) {

        return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";
};
