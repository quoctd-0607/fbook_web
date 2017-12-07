$(document).ready(function() {
    $('.notification_onclick_icon').on('click', function (e) {
        $.ajax({
            url: API_PATH + 'notifications/dropdown',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'GET',
            data: JSON.stringify(),
        }).done(function (response) {
            var htmlModel;
            var showChar = 50;
            var ellipsestext = '...';
            if (response.items.notification.data.length) {
                htmlModel = "<div class=''>"
                response.items.notification.data.forEach(function (data) {
                    if(data.viewed == configs.notification.not_view) {
                        htmlModel += "<div class='noSeen notificaiton-item click-notification clearfix'>";
                    } else {
                        htmlModel += "<div class='seen notificaiton-item click-notification clearfix'>";
                    }
                    htmlModel += "<div class='media-left'>";
                    htmlModel += "<img src='" + data.user_send.avatar + "' class='avatar avatar-popup-noti' alt='library'/></div>";
                    htmlModel += "<div  class='noti-body-popup media-body media-body-notification'>";
                    if(data.type == configs.notification.waiting) {
                        htmlModel += "<a href='/books/" + data.book.id
                        + "/approve-request' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                        + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Waiting book request: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Waiting book request: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id + "'>waiting</span>";
                    } else if (data.type == configs.notification.cancel) {
                            htmlModel += "<a href='#' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Cancel book request: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Cancel book request: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id + "'>cancel</span>";
                    } else if (data.type == configs.notification.review) {
                            htmlModel += "<a href='/books/" + data.book.id
                            + "' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Review Book: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Review Book: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id + "'>review</span>";
                    } else if (data.type == configs.notification.returning) {
                            htmlModel += "<a href='/books/" + data.book.id
                            + "/approve-request' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Returning book: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Returning book: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id + "'>returning</span>";
                    } else if (data.type == configs.notification.returned) {
                            htmlModel += "<a href='/books/" + data.book.id
                            + "/approve-request' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Return done book: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Return done book: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id + "'>returned</span>";
                    } else if (data.type == configs.notification.approve_returning) {
                            htmlModel += "<a href='/books/" + data.book.id
                            + "' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Return books successfully: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Return books successfully: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id + "'>approve_returning</span>";
                    } else if (data.type == configs.notification.request_edit_book) {
                            htmlModel += "<a href='/admin/waiting-request-edit-book"
                            + "' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Want to edit book: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Want to edit book: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id + "'>request edit book</span>";
                    } else if (data.type == configs.notification.approve_request_update_book) {
                            htmlModel += "<a href='#"
                            + "' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Approve your request edit book: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Approve your request edit book: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id
                    + "'>approve request edit book</span>";
                    } else if (data.type == configs.notification.delete_request_update_book) {
                            htmlModel += "<a href='#"
                            + "' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Unapprove your request edit book: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Unapprove your request edit book: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id
                    + "'>unapprove request edit books</span>";
                    } else if (data.type == configs.notification.approve_waiting) {
                            htmlModel += "<a href='/books/" + data.book.id
                            + "' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='"
                            + data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + " </span>" + "Accept your request waiting book: " + content + ellipsestext + "</p>";
                        } else {
                            htmlModel += "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>"
                            + data.user_send.name + "</span>" + "Accept your request waiting book: " + data.book.title + "</p>";
                        }
                    htmlModel += "<span class='text-color-noti label label-warning lbl-waiting" + data.user_send.id
                    + "'>approve_waiting</span>";
                    }
                    htmlModel += "<p class='show text-danger pull-right time-ago-notification-dropdown'><span class='time_a_go'>"
                    + data.created_at + "</span></p></a></div></div>";
                });
                htmlModel += "</div>";
                $('#box_dropdown_noti').html(htmlModel);
                var h = document.getElementsByTagName("head")[0];
                var script = document.createElement("script");
                script.src = 'javascripts/users/notification.js';
                h.appendChild(script);
            }
        }).fail(function (error) {
            showNotify('danger', "Data Invalid", {icon: "glyphicon glyphicon-remove"}, {delay: 1000});
        });
    });
});
