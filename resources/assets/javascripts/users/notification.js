
$(function ($) {
    $('.notification_onclick').on('click', function (e) {
        var notificationId = $(this).data('notification-id');
        $.ajax({
            url: API_PATH + 'notification/update/' + notificationId,
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'GET',
            data: {},
        }).done(function (response) {
            if (response.message.code == 200) {
                if($('.count_Notifications').html() > 0) {
                    $('.count_Notifications').html(parseInt($('.count_Notifications').html()) - 1);
                }
            } else {
                showNotify(
                    'danger', 
                    'Data Invalid', 
                    {icon: 'glyphicon glyphicon-remove'}, 
                    {delay: 3000}
                );
            }
        }).fail(function (error) {
            showNotify(
                'danger', 
                'Data Invalid', 
                {icon: 'glyphicon glyphicon-remove'}, 
                {delay: 3000}
            );
        });
    });
    
    $('.time_a_go').each(function() {
        $(this).html(timeAGo($(this).html()));
    });
}(jQuery));

if (typeof timeAGo === 'undefined') {
    function timeAGo ( date ) {
        var seconds = Math.floor(( Date.parse(new Date()) - Date.parse(date) ) / 1000 );

        interval = Math.floor( seconds / 86400 );
        if (interval > 30) {
            return date;
        }
        if (interval == 1) {
            return interval + ' day ago';
        }
        if (interval > 1) {
            return interval + ' days ago';
        }

        interval = Math.floor( seconds / 3600 );
        if (interval == 1) {
            return interval + ' hour ago';
        }
        if (interval > 1) {
            return interval + ' hours ago';
        }
        
        interval = Math.floor( seconds / 60 );
        if (interval == 1) {
            return interval + ' minute ago';
        }
        if (interval > 1) {
            return interval + ' minutes ago';
        }

        return Math.floor(seconds) + ' seconds ago';
    };
}

if (typeof mark_read_all_notifications === 'undefined') {
    function mark_read_all_notifications() {
        $.ajax({
            url: API_PATH + 'notifications/update/all',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'POST',
            data: {},
        }).done(function (response) {
            if (response.message.code == 200) {
                $('.count_Notifications').html(0);
            } else {
                showNotify(
                    'danger', 
                    'Data Invalid', 
                    {icon: 'glyphicon glyphicon-remove'}, 
                    {delay: 1000}
                );
            }
        }).fail(function (error) {
            showNotify(
                'danger', 
                'Data Invalid', 
                {icon: 'glyphicon glyphicon-remove'}, 
                {delay: 1000}
            );
        });
    };
}
