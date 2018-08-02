$(function ($) {
    "use strict";

    $('.mainmenu-area a[href*="#"]:not([href="#"])').on('click', function(e) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
    $(".carousel-inner .item:first-child").addClass("active");

    /*WoW js Active
    =================*/
    new WOW().init({
        mobile: false,
    });

    /* Scroll to top
    ===================*/
    $.scrollUp({
        scrollText: '<i class="glyphicon glyphicon-chevron-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });

    $('.my-slider').cardslider({
        swipe: true,
        dots: false,
        direction: 'down',
        loop: true,
    });

    //Header Background Slider
    $('.home-slide').responsiveSlides({
        auto: true, // Boolean: Animate automatically, true or false
        speed: 600, // Integer: Speed of the transition, in milliseconds
        timeout: 4000, // Integer: Time between slide transitions, in milliseconds
        pager: true, // Boolean: Show pager, true or false
    });

    // Book List Slider
    var book_slide = $('.book-list');
    book_slide.owlCarousel({
        loop: true,
        margin: 30,
        dots: true,
        autoplayTimeout: 4000,
        smartSpeed: 600,
        mouseDrag: true,
        touchDrag: false,
        animateIn: 'fadeInLeft',
        animateOut: 'fadeOutRight',
        center: true,
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            992: { items: 2 },
            1500: { items: 4 }
        }
    });
    $('.bookslide_nav .testi_next').on('click', function(e) {
        book_slide.trigger('next.owl.carousel');
    });
    $('.bookslide_nav .testi_prev').on('click', function(e) {
        book_slide.trigger('prev.owl.carousel');
    });

    book_slide.on('translate.owl.carousel', function(property) {
        $('.book-content .owl-dot:eq(' + property.page.index + ')').click();
    });

    /* Gallery Slider Active
    =============================*/
    $('.team_slide').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        nav: false,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        center: true,
        navText: ['<i class="icofont icofont-long-arrow-left"></i>', '<i class="icofont icofont-long-arrow-right"></i>'],
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 }
        }
    });

    /* Gallery Slider Active
    =============================*/
    $('.testimonial-slide').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        center: true,
        navText: ['<i class="icofont icofont-long-arrow-left"></i>', '<i class="icofont icofont-long-arrow-right"></i>'],
        items: 1
    });
    $('.wow').parent('div').addClass('fix');

    var showChar = 500;
    var ellipsestext = '...';
    var moretext = i18n['Show more'];
    var lesstext = i18n['Show less'];
    $('.more').each(function() {
        var content = $(this).html();
        if (content.length > showChar) {
            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);
            var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
            $(this).html(html);
        }
    });

    $('.morelink').on('click', function(e) {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();

        return false;
    });

    $('.delete-btn-topright').on('click', function(e) {
        var reviewId = $(this).val();
        var numbReview = $('#review-span').html();
        $.ajax({
            url: API_PATH + 'reviews/delete/' + reviewId,
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'DELETE',
            data: {},
        }).done(function(response) {
            if (response.message.code == 200) {
                showNotify(
                    'success', 
                    i18n['Delete review successfull!'], 
                    {icon: 'glyphicon glyphicon-remove'}, 
                    {delay: 3000}
                );
                $('#review-span').html(--numbReview);
                $('#review' + reviewId).remove();
                $('#review_edit_btn').html('Add review');
            } else {
                showNotify(
                    'danger', 
                    i18n['Opp\'s something went wrong'], 
                    {icon: 'glyphicon glyphicon-remove'}, 
                    {delay: 3000}
                );
            }
        }).fail(function(error) {
            showNotify(
                'danger', 
                i18n['Opp\'s something went wrong'], 
                {icon: 'glyphicon glyphicon-remove'}, 
                {delay: 3000}
            );
        });
    });

    $('.btn_vote').on('click', function(e) {
        var review_id = $('#review_data').val();
        var user_id = $('#user_id' + review_id).val();
        var status_id = $(this).val();
        var current_vote = parseInt($('#btn_show_vote').text());
        var reviewer_id = $('#reviewer_id').val();

        $.ajax({
            url: API_PATH + 'books/vote',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'POST',
            data: JSON.stringify({
                reviewId: review_id,
                userId: user_id,
                status: status_id,
                reviewerId: reviewer_id
            }),
        }).done(function(response) {
            if (response.message.code == 200) {
                if (response.items.messages == 'vote_success') {
                    if (status_id == 2) {
                        $('.up_vote').attr('style', 'color: #5488c7;');
                        $('#btn_show_vote').html(current_vote + 1);
                    } else {
                        $('.down_vote').attr('style', 'color: #5488c7;');
                        $('#btn_show_vote').html(current_vote - 1);
                    }
                    showNotify('success', i18n['Thanks for your vote!'], 
                        {icon: 'glyphicon glyphicon-remove'}, 
                        {delay: 3000});
                } else if (response.items.messages == 'owner_can_not_vote') {
                    showNotify(
                        'danger', 
                        i18n['You can not vote for your review!'], 
                        {icon: 'glyphicon glyphicon-remove'}, 
                        {delay: 3000}
                    );
                } else if (response.items.messages == 'revote_success') {
                    if (status_id == 2) {
                        $('.up_vote').attr('style', 'color: #5488c7;');
                        $('.down_vote').attr('style', 'color: #A9A9A9;');
                        $('#btn_show_vote').html(current_vote + 2);
                    } else {
                        $('.down_vote').attr('style', 'color: #5488c7;');
                        $('.up_vote').attr('style', 'color: #A9A9A9;');
                        $('#btn_show_vote').html(current_vote - 2);
                    }
                    showNotify(
                        'success', 
                        i18n['Thanks for your revote!'], 
                        {icon: 'glyphicon glyphicon-remove'}, 
                        {delay: 3000}
                    );
                } else {
                    showNotify(
                        'danger', 
                        i18n['Your just up or down vote once!'], 
                        {icon: 'glyphicon glyphicon-remove'}, 
                        {delay: 1000}
                    );
                }
            }
        }).fail(function(error) {
            showNotify(
                'danger', 
                i18n['Opp\'s something went wrong'], 
                {icon: 'glyphicon glyphicon-remove'}, 
                {delay: 3000}
            );
        });
    });

    $('.delete_comment_topright').on('click', function(e) {
        var id = $(this).val();
        $.ajax({
            url: API_PATH + 'books/review-details/remove-comment/' + id,
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'DELETE',
            data: {},
        }).done(function(response) {
            if (response.message.code == 200) {
                $('#comment' + id).remove();
                showNotify(
                    'success', 
                    i18n['Delete comment successfull!'], 
                    {icon: "glyphicon glyphicon-remove"}, 
                    {delay: 3000}
                );
            } else {
                showNotify(
                    'danger', 
                    i18n['Opp\'s something went wrong'], 
                    {icon: 'glyphicon glyphicon-remove'}, 
                    {delay: 3000}
                );
            }
        }).fail(function(error) {
            showNotify(
                'danger', 
                i18n['Opp\'s something went wrong'], 
                {icon: 'glyphicon glyphicon-remove'}, 
                {delay: 3000}
            );
        });
    });

    $('.edit_comment_topright').on('click', function(e) {
        var id = $(this).attr('data-comment-id');
        var userId = $(this).attr('data-user-id');
        var reviewId = $(this).attr('data-review-id');
        var content = $(this).attr('data-comment-content');
        var edit = $(this);
        
        var form = '';
        form += '<form class="comment-update" method="POST">';
        form += '<input type="hidden" name="reviewId" class="review_id" value=' + reviewId + '>';
        form += '<input type="hidden" name="userId" class="user_id" value=' + userId + '>';
        form += '<input type="hidden" name="id" class="comment_id" value=' + id + '>';
        form += '<textarea name="content" class="content_update form-control">' + content + '</textarea>';
        form += '<button type="button" class="btn btn-primary hover-btn-default edit-comment">Edit</button>';
        form += '</form>';
        edit.parents('.event-item').find('.content-comment').html(form);
    });

    $('body').on('click', '.edit-comment', function(e) {
        var data = $('.comment-update').serializeFormJSON();
        $.ajax({
            url: API_PATH + 'books/review-details/editcomment',
            headers: {'Accept': 'application/json', 'Authorization': access_token},
            method: 'POST',
            data: data
        }).done(function(response) {
            $("#edit_comment_topright" + data['id']).attr('data-comment-content', data['content']);
            $(".comment-update").remove();
            $('#content-comment-' + data['id']).html('<p>' + data['content'] + '</p>');
            showNotify(
                'success', 
                i18n['Edit comment successfull!'], 
                {icon: 'glyphicon glyphicon-remove'}, 
                {delay: 3000});
        }).fail(function(error) {
            showNotify(
                'danger', 
                i18n['Opp\'s something went wrong'], 
                {icon: 'glyphicon glyphicon-remove'}, 
                {delay: 3000}
            );
        });
    });

    if (typeof(access_token) !== 'undefined') {
        $.ajax({
            url: API_PATH + 'notifications/count/user',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
            type: 'GET',
            data: {},
        }).done(function(response) {
            if (response.message.code == 200) {
                if (response.item.count == 0) {
                    $('.count_Notifications').html(0);
                } else {
                    $('.count_Notifications').html(response.item.count);
                }
            } else {
                showNotify(
                    'danger', 
                    i18n['Data Invalid'], 
                    {icon: 'glyphicon glyphicon-remove'}, 
                    {delay: 1000}
                );
            }
        }).fail(function(error) {
            showNotify(
                'danger', 
                i18n['Data Invalid'], {
                icon: 'glyphicon glyphicon-remove'}, 
                {delay: 1000}
            );
        });
    }
}(jQuery));
