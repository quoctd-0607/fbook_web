jQuery(document).ready(function($) {
    "use strict";
    $('.mainmenu-area a[href*="#"]:not([href="#"])').on('click', function() {
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
        scrollText: '<i class="icofont icofont-long-arrow-up"></i>',
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
    $(".home-slide").responsiveSlides({
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
    $('.bookslide_nav .testi_next').on('click', function() {
        book_slide.trigger('next.owl.carousel');
    });
    $('.bookslide_nav .testi_prev').on('click', function() {
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
    var ellipsestext = "...";
    var moretext = "Show more";
    var lesstext = "Show less";
    $('.more').each(function() {
        var content = $(this).html();
        if (content.length > showChar) {
            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);
            var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
            $(this).html(html);
        }
    });

    $('.morelink').click(function() {
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

    if (typeof(access_token) !== 'undefined') {
        $.ajax({
            url: API_PATH + 'notifications/count/user',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
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
                showNotify('danger', "Data Invalid", {
                    icon: "glyphicon glyphicon-remove"
                }, {
                    delay: 1000
                });
            }
        }).fail(function(error) {
            showNotify('danger', "Data Invalid", {
                icon: "glyphicon glyphicon-remove"
            }, {
                delay: 1000
            });
        });
    }

    $('.delete-btn-topright').click(function() {
        let reviewId = $(this).val();
        $.ajax({
            url: API_PATH + 'reviews/delete/' + reviewId,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'DELETE',
            data: {},
        }).done(function(response) {
            if (response.message.code == 200) {
                showNotify('success', "Delete review successfull!", {
                    icon: "glyphicon glyphicon-remove"
                }, {
                    delay: 1000
                });
                $('#review' + reviewId).remove();
                $('#review_edit_btn').html('Add review');
            } else {
                showNotify('danger', "Opp\'s something went wrong", {
                    icon: "glyphicon glyphicon-remove"
                }, {
                    delay: 1000
                });
            }
        }).fail(function(error) {
            showNotify('danger', "Opp\'s something went wrong", {
                icon: "glyphicon glyphicon-remove"
            }, {
                delay: 1000
            });
        });
    });

    $('.btn_vote').click(function() {
        let review_id = $('#review_data').val();
        let user_id = $('#user_id' + review_id).val();
        let status_id = $(this).val();
        let current_vote = parseInt($('#btn_show_vote').text());

        $.ajax({
            url: API_PATH + 'books/vote',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'POST',
            data: JSON.stringify({
                reviewId: review_id,
                userId: user_id,
                status: status_id
            }),
        }).done(function(response) {
            if (response.message.code == 200) {
                if (response.items.messages == 'vote_success') {
                    if (status_id == 2) {
                        $('.up_vote').attr("style", "color: #5488c7;");
                        $('#btn_show_vote').html(current_vote + 1);
                    } else {
                        $('.down_vote').attr("style", "color: #5488c7;");
                        $('#btn_show_vote').html(current_vote - 1);
                    }
                    showNotify('success', "Thanks for your vote!", {
                        icon: "glyphicon glyphicon-remove"
                    }, {
                        delay: 1000
                    });
                } else if (response.items.messages == 'owner_can_not_vote') {
                    showNotify('danger', "You can not vote for your review!", {
                        icon: "glyphicon glyphicon-remove"
                    }, {
                        delay: 1000
                    });
                } else if (response.items.messages == 'revote_success') {
                    if (status_id == 2) {
                        $('.up_vote').attr("style", "color: #5488c7;");
                        $('.down_vote').attr("style", "color: #A9A9A9;");
                        $('#btn_show_vote').html(current_vote + 2);
                    } else {
                        $('.down_vote').attr("style", "color: #5488c7;");
                        $('.up_vote').attr("style", "color: #A9A9A9;");
                        $('#btn_show_vote').html(current_vote - 2);
                    }
                    showNotify('success', "Thanks for your revote!", {
                        icon: "glyphicon glyphicon-remove"
                    }, {
                        delay: 1000
                    });
                } else {
                    showNotify('danger', "Your just up or down vote once!", {
                        icon: "glyphicon glyphicon-remove"
                    }, {
                        delay: 1000
                    });
                }
            }
        }).fail(function(error) {
            showNotify('danger', "Opp\'s something went wrong", {
                icon: "glyphicon glyphicon-remove"
            }, {
                delay: 1000
            });
        });
    });

    $('.delete_comment_topright').click(function() {
        let id = $(this).val();
        $.ajax({
            url: API_PATH + 'books/review-details/remove-comment/' + id,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'DELETE',
            data: {},
        }).done(function(response) {
            if (response.message.code == 200) {
                $('#comment' + id).remove();
                showNotify('success', "Delete comment successfull!", {
                    icon: "glyphicon glyphicon-remove"
                }, {
                    delay: 1000
                });
            } else {
                showNotify('danger', "Opp\'s something went wrong", {
                    icon: "glyphicon glyphicon-remove"
                }, {
                    delay: 1000
                });
            }
        }).fail(function(error) {
            showNotify('danger', "Opp\'s something went wrong", {
                icon: "glyphicon glyphicon-remove"
            }, {
                delay: 1000
            });
        });
    });

}(jQuery));
