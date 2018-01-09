function showNotify(message, messageType, timer)
{
    $.toast({
        heading: 'Notification',
        text: message,
        position: 'top-right',
        loaderBg: '#ff6849',
        icon: messageType,
        hideAfter: timer
    });
}

timeAGo = function ( date ) {
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

$(document).ready(function() {
    $('.time_a_go').each(function() {
        $(this).html(timeAGo($(this).html()));
    });

    $('._approve-btn').on('click', function() {
        $(this).addClass('disabled');
        $(this).html($(this).data('loading'));
    });
});
