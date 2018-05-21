
$(function ($) {
    $('.notification_onclick_icon').on('click', function(e) {
        $.ajax({
            url: API_PATH + 'notifications/dropdown',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'GET',
            data: JSON.stringify(),
        }).done(function(response) {
            var htmlModel;
            var showChar = 50;
            var ellipsestext = '...';
            if (response.items.notification.data.length) {
                htmlModel = "<div class=''>"
                response.items.notification.data.forEach(function(data) {
                    if (data.viewed == configs.notification.not_view) {
                        htmlModel += "<div class='noSeen notificaiton-item click-notification clearfix'>";
                    } else {
                        htmlModel += "<div class='seen notificaiton-item click-notification clearfix'>";
                    }
                    htmlModel += "<div class='media-left'>";
                    htmlModel += "<img src='" + data.user_send.avatar + "' class='avatar avatar-popup-noti' alt='library'/></div>";
                    htmlModel += "<div  class='noti-body-popup media-body media-body-notification'>";
                    if (data.type == configs.notification.waiting) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "/approve-request' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown fix-text'>" +
                                data.user_send.name + " </span>" + "<span> " + i18n['Waiting book request'] +": " + content + ellipsestext +
                                "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " + i18n['Waiting book request'] +": " + data.book.title + "</span>" +
                                "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-warning lbl-waiting" +
                            data.user_send.id + "'>" + i18n['Waiting'] + "</span>";
                    } else if (data.type == configs.notification.cancel) {
                        htmlModel +=
                            "<a href='#' class='a-notification-dropdown clearfix notification_onclick' data-notification-id='" +
                            data.id + "'>";
                        htmlModel += "<div class='hidden' id='get-notify-view" + data.id +
                            "'>" + data.viewed + "</div>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span>" + i18n['Cancel book request'] + ": " + content + ellipsestext +
                                "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span>" + i18n['Cancel book request'] + ": " + data.book.title + "</span>" +
                                "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-warning lbl-waiting" +
                            data.user_send.id + "'>" + i18n['cancel'] + "</span>";
                    } else if (data.type == configs.notification.review) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " + i18n['Review Book'] + ": " + content + ellipsestext + "</span>" +
                                "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " + i18n['Review Book'] + ": " + data.book.title + "</span>" + "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-primary lbl-waiting" +
                            data.user_send.id + "'>" + i18n['review'] + "</span>";
                    } else if (data.type == configs.notification.up_vote) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " +
                                i18n['Upvoted your review in book'] + ": " + content +
                                ellipsestext + "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " +
                                i18n['Upvoted your review in book'] + ": " + data.book.title + ". " +
                                i18n['You are received '] + configs.reputation.be_upvoted + i18n['point'] +
                                "</span>" + "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-success lbl-waiting" +
                            data.user_send.id + "'>" + i18n['UpVote'] + "</span>";
                    } else if (data.type == configs.notification.down_vote) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " +
                                i18n['Downvoted your review in book'] + ": " + content +
                                ellipsestext + "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " +
                                i18n['Downvoted your review in book'] + ": " + data.book.title +
                                "</span>" + "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-danger lbl-waiting" +
                            data.user_send.id + "'>" + i18n['DownVote'] + "</span>";
                    } else if (data.type == configs.notification.returning) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "/approve-request' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + " <span> " +
                                i18n['Returning book'] + ": " + content + ellipsestext + "</span>" +
                                "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + " <span> " +
                                i18n['Returning book'] + data.book.title + "</span>" +
                                "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-warning lbl-waiting" +
                            data.user_send.id + "'>" + i18n['returning'] + "</span>";
                    } else if (data.type == configs.notification.returned) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "/approve-request' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " +
                                i18n['Return done book'] + ": " + content + ellipsestext +
                                "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " +
                                i18n['Return done book'] + ": " + data.book.title + "</span>" +
                                "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-success lbl-waiting" +
                            data.user_send.id + "'>" + i18n['returned'] + "</span>";
                    } else if (data.type == configs.notification.approve_returning) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " +
                                i18n['Return books successfully'] + ": " + content + ellipsestext +
                                "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " +
                                i18n['Return books successfully'] + ": " + data.book.title +
                                "</span>" + "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-primary lbl-waiting" +
                            data.user_send.id + "'>" + i18n['approve returning'] + "</span>";
                    } else if (data.type == configs.notification.request_edit_book) {
                        htmlModel += "<a href='/admin/waiting-request-edit-book" +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " +
                                i18n['Want to edit book'] + ": " + content + ellipsestext +
                                "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " +
                                i18n['Want to edit book'] + ": " + data.book.title + "</span>" +
                                "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-warning lbl-waiting" +
                            data.user_send.id + "'>" + i18n['request edit book'] + "</span>";
                    } else if (data.type == configs.notification.approve_request_update_book) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " +
                                i18n['Requests edit book'] + ": " + content +
                                ellipsestext + "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " +
                                i18n['Requests edit book'] + ": " + data.book.title +
                                "</span>" + "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-success lbl-waiting" +
                            data.user_send.id +
                            "'>" + i18n['Requests edit book'] + "</span>";
                    } else if (data.type == configs.notification.delete_request_update_book) {
                        htmlModel += "<a href='#" +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        htmlModel += "<div class='hidden' id='get-notify-view'>" + data
                            .viewed + "</div>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " +
                                i18n['Unapprove your request edit book'] + ": " + content +
                                ellipsestext + "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " +
                                i18n['Unapprove your request edit book'] + ": " + data.book.title +
                                "</span>" + "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-danger lbl-waiting" +
                            data.user_send.id +
                            "'>" + i18n['Unapprove your request edit book'] + "</span>";
                    } else if (data.type == configs.notification.approve_waiting) {
                        htmlModel += "<a href='/books/" + data.book.id +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>";
                        if (data.book.title.length > showChar) {
                            var content = data.book.title.substr(0, showChar);
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + " </span>" + "<span> " +
                                i18n['Accept your request waiting book'] + ": " + content +
                                ellipsestext + "</span>" + "</p>";
                        } else {
                            htmlModel +=
                                "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                                data.user_send.name + "</span>" + "<span> " +
                                i18n['Accept your request waiting book'] + ": " + data.book.title +
                                "</span>" + "</p>";
                        }
                        htmlModel +=
                            "<span class='text-color-noti label label-warning lbl-waiting" +
                            data.user_send.id +
                            "'>" + i18n['approve waiting'] + "</span>";
                    } else if (data.type == configs.notification.follow) {
                        htmlModel += "<a href='/users/" + data.user_send.id +
                            "' class='a-notification-dropdown clearfix notification_onclick' style='display: block;' data-notification-id='" +
                            data.id + "'>" +
                            "<p class='notification-p content-notification-dropdown'><span class='user-name-noti-dropdown'>" +
                            data.user_send.name + "</span>" + "<span> " +
                            i18n['Just follow you'];
                        if (data.follow != null && data.follow.deleted_at == null) {
                            htmlModel += i18n['You are received '] + configs.reputation.be_followed + i18n['point']
                        }
                        htmlModel += "</span>" + "</p>" + "<span class='text-color-noti label label-success" +
                            "'>" + i18n['Follow'] + "</span>";
                    }
                    htmlModel +=
                        "<p class='show text-danger pull-right time-ago-notification-dropdown'><span class='time_a_go'>" +
                        data.created_at + "</span></p></a></div></div>";
                });
                htmlModel += "</div>";
                $('#box_dropdown_noti').html(htmlModel);

                $('.notification_onclick').each(function(e) {
                    $(this).on('click', function(e) {
                        var notificationId = $(this).data('notification-id');
                        $.ajax({
                            url: API_PATH + 'notification/update/' + notificationId,
                            contentType: 'application/json',
                            dataType: 'json',
                            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
                            type: 'GET',
                            data: {},
                        }).done(function(response) {
                            if (response.message.code == 200) {
                                if ($('.count_Notifications').html() > 0) {
                                    $('.count_Notifications').html(
                                        parseInt($('.count_Notifications').html()) - 1);
                                    if ($('#get-notify-view' + notificationId).html() == 1) {
                                        $('.count_Notifications').html(parseInt($('.count_Notifications').html()) + 1);
                                    }
                                }
                            } else {
                                showNotify(
                                    'danger',
                                    i18n['Data Invalid'],
                                    {icon: 'glyphicon glyphicon-remove'},
                                    {delay: 3000}
                                );
                            }
                        }).fail(function(error) {
                            showNotify(
                                'danger',
                                i18n['Data Invalid'],
                                {icon: 'glyphicon glyphicon-remove'},
                                {delay: 3000});
                        });
                    })
                });
                $('.time_a_go').each(function() {
                    $(this).html(timeAGo($(this).html()));
                });
            }
        }).fail(function(error) {
            showNotify(
                'danger',
                i18n['Data Invalid'],
                {icon: 'glyphicon glyphicon-remove'},
                {delay: 1000}
            );
        });
    });
}(jQuery));
