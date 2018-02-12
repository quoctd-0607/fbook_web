if (typeof showNotify === 'undefined') {
    function showNotify(message, messageType, timer) {
        $.toast({
            heading: 'Notification',
            text: message,
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: messageType,
            hideAfter: timer
        });
    }
}

if (typeof markAsRead === 'undefined') {
    function markAsRead() {
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
    };
}

if (typeof timeAGo === 'undefined') {
    function timeAGo (date) {
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

Pusher.logToConsole = false;
var pusher = new Pusher(configs.pusher.key, {
    cluster: configs.pusher.cluster,
    encrypted: configs.pusher.encrypted
});

var channel = pusher.subscribe('channel_notification');
channel.bind('App\\Events\\NotificationHandler', function(data) {
    $('#notification_' + data.user_id).html(parseInt($('#notification_' + data.user_id).html()) + 1);
    $('#notification_icon_' + data.user_id).html(parseInt($('#notification_icon_' + data.user_id).html())+1);
    if(data.user_id == $('#get-user-id').html()) {
        showNotify(
            'info', 
            data.messages, 
            {icon: 'glyphicon glyphicon-ok'}, 
            {delay: 3000}
        );
    }
});


$(function ($) {
    if(typeof(access_token) !== 'undefined') {
        $.ajax({
            url: API_PATH + 'notifications/count/user',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'GET',
            data: {},
        }).done(function (response) {
            if (response.message.code == 200) {
                if(response.item.count == 0) {
                    $('.count_Notifications').html(0);
                } else {
                    $('.count_Notifications').html(response.item.count);
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
                {delay: 1000}
            );
        });
    }

    $('.time_a_go').each(function() {
        $(this).html(timeAGo($(this).html()));
    });

    $('._approve-btn').on('click', function() {
        $(this).addClass('disabled');
        $(this).html($(this).data('loading'));
    });

    $('body').on('click', '.view-notify', function (e) {
        $.ajax({
            url: API_PATH + 'notifications/dropdown',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'GET',
            data: JSON.stringify(),
        }).done(function (response) {
            var htmlModel;
            var showChar = 50;
            var ellipsestext = '...';

            if (response.items.notification.data.length) {
                htmlModel = '<ul class="menu inner-content-div">'

                response.items.notification.data.forEach(function (data) {
                    if(data.viewed == configs.notification.not_view) {
                        htmlModel += '<li class="unread-noti">';
                    } else {
                        htmlModel += '<li class="flex-list">';
                    }
                    htmlModel += '<span class="img-side">';
                    htmlModel += '<img src="' + data.user_send.avatar + '" class="noti-avatar rounded-circle"/></span>';
                    
                    if(data.type == configs.notification.waiting) {//
                        htmlModel += "<a href='/books/" + data.book.id
                                    + "/approve-request' class='normal-white-space' data-notification-id='"
                                    + data.id + "'>";
                        
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Waiting book request: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Waiting book request: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id + '">waiting</span>';
                    } else if (data.type == configs.notification.cancel) {//
                            htmlModel += "<a href='javascript:void(0)' class='normal-white-space' data-notification-id='"
                                        + data.id + "'>";
                            htmlModel += "<div class='hidden' id='get-notify-view" + data.id + "'>" + data.viewed + "</div>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Cancel book request: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Cancel book request: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id + '">cancel</span>';
                    } else if (data.type == configs.notification.review) {//
                            htmlModel += "<a href='/books/" + data.book.id
                                        + "' class='normal-white-space' data-notification-id='"
                                        + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " Review Book: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " Review Book: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id + '">review</span>';
                    } else if (data.type == configs.notification.returning) {
                            htmlModel += "<a href='/books/" + data.book.id
                                        + "/approve-request' class='normal-white-space' data-notification-id='"
                                        + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Returning book: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Returning book: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id + '">returning</span>';
                    } else if (data.type == configs.notification.returned) {
                        htmlModel += "<a href='/books/" + data.book.id
                            + "/approve-request' class='normal-white-space' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Return done book: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Return done book: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id + '">returned</span>';
                    } else if (data.type == configs.notification.approve_returning) {
                            htmlModel += "<a href='/books/" + data.book.id
                                        + "' class='normal-white-space' data-notification-id='"
                                        + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + "- Return books successfully: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Return books successfully: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id + '">approve_returning</span>';
                    } else if (data.type == configs.notification.request_edit_book) {
                            htmlModel += "<a href='/admin/waiting-request-edit-book"
                                        + "' class='normal-white-space' data-notification-id='"
                                        + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Want to edit book: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Want to edit book: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id + '">request edit book</span>';
                    } else if (data.type == configs.notification.approve_request_update_book) {
                            htmlModel += "<a href='/books/" + data.book.id
                                        + "' class='normal-white-space' data-notification-id='"
                                        + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name +  " Approve your request edit book: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Approve your request edit book: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id
                                    + '">approve request edit book</span>';
                    } else if (data.type == configs.notification.delete_request_update_book) {
                            htmlModel += "<a href='#"
                                        + "' class='normal-white-space' data-notification-id='"
                                        + data.id + "'>";
                            htmlModel += "<div class='hidden' id='get-notify-view'>" + data.viewed + "</div>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Unapprove your request edit book: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Unapprove your request edit book: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id
                                    + '">unapprove request edit books</span>';
                    } else if (data.type == configs.notification.approve_waiting) {
                            htmlModel += "<a href='/books/" + data.book.id
                                        + "' class='normal-white-space' data-notification-id='"
                                        + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name +  " - Accept your request waiting book: " + content + ellipsestext + "</span>";
                        } else {
                            htmlModel += '<span class="notify-content">'
                                        + data.user_send.name + " - Accept your request waiting book: " + data.book.title + "</span>";
                        }
                        htmlModel += '<span class="badge badge-warning size-100-percent' + data.user_send.id
                                    + '">approve_waiting</span>';
                    }
                    htmlModel += '<span class="pull-right padding-left-10 diff-time">' + data.created_at + '</span></a></li>';
                });
                htmlModel += '</ul>';
                $('#noti-list').html(htmlModel);

                $('.notification_onclick').each(function (e) {
                    $(this).on('click', function() {
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
                                    if($('#get-notify-view' + notificationId).html() == 1) {
                                        $('.count_Notifications').html(parseInt($('.count_Notifications').html()) + 1);
                                    }
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
                    })
                });
                $('.diff-time').each(function() {
                    $(this).html(timeAGo($(this).html()));
                });
            } else {
                $('#noti-list').html('');
            }
        }).fail(function (error) {
            showNotify(
                'danger', 
                'Opp\'s something went wrong', 
                {icon: 'glyphicon glyphicon-remove'}, 
                {delay: 3000}
            );
        });
    });

    $('.delete_book').on('click', function(e) {
        e.preventDefault();
        var id = $(this).val();
        swal({
            title: "Are you sure delete",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: true
        },
        function() {

            $.ajax({
                url: API_PATH + 'admin/books/delete/' + id,
                contentType: 'application/json',
                dataType: 'json',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
                type: 'DELETE',
                data: {},
            }).done(function(response) {
                if (response.message.code == 200) {
                    $('#book' + id).remove();
                    showNotify(
                        'success', 
                        'Delete book successfull!', 
                        {icon: 'glyphicon glyphicon-remove'}, 
                        {delay: 3000}
                    );
                } else {
                    showNotify(
                        'danger', 
                        'Opp\'s something went wrong', 
                        {icon: 'glyphicon glyphicon-remove'}, 
                        {delay: 3000}
                    );
                }
            }).fail(function(error) {
                showNotify(
                    'danger', 
                    'Opp\'s something went wrong', 
                    {icon: 'glyphicon glyphicon-remove'}, 
                    {delay: 3000}
                );
            });
        });
    });
}(jQuery));
