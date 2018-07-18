$(function ($) {
    $('body').on('keyup', '#search-box', function (e) {
        $('.search-result').show();
        
        delay(function(){
            e.preventDefault();
            searchBooks();
        }, 500);
    });

    $('input[name="search-box"]').click(function(){
        $(".search-result").toggle();
    });
    $('input[name="search-box"]').focusout(function(){
        $(this).val('');
    });
    $(document).click(function() {
        $(".search-result").hide();
    });

    $('body').on('keyup', '#search-book-google', function (e) {
        delay(function(){
            e.preventDefault();
            searchBooksGoogle();
        }, 500);
    });

    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();
}(jQuery));
if (typeof searchBooks === 'undefined') { 
    function searchBooks() {
        if ($('#search-box').val() == '') {
            $('#data-search').empty();
        } else {
            $.ajax({
                url: API_PATH + 'search',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                type: 'POST',
                data: JSON.stringify({
                    search: {
                        keyword: $('#search-box').val(),
                    }
                }),
            }).done(function (response) {
                $('#data-search').empty();
                var maxsearch = 3;

                if (response.titles.total == 0) {
                    $('#data-search').append('<li><a href="#" class="bg-lightgray"><h5 class="m-0">' + i18n['TITLE'] + '</h5></a></li>');
                    $('#data-search').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
                } else {
                    $('#data-search').append('<li><a href="#" class="bg-lightgray"><h5 class="m-0">' + i18n['TITLE'] + '</h5></a></li>');
                    for (var i = 0; i < maxsearch; i++) {
                        response.titles.data.forEach(function (book) {
                        if (i < maxsearch) {
                            if (book.image) {
                                $('#data-search').append('<li><a href="/books/'
                                    + book.id + '" class="search-book-url"><img src="'
                                    + book.image.web.thumbnail_path
                                    + '", class="search-img"><b class="book-search">'
                                    + book.title.slice(0, configs.search.title_limit_search) 
                                    + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                    + '<br><p class="author-search">'
                                    + book.author
                                    + '</p></b></a></li>'
                                );
                            } else {
                                $('#data-search').append('<li><a href="/books/'
                                    + book.id
                                    + '" class="search-book-url"><img src="/images/book_thumb_default.jpg" class="search-img"><b class="book-search">'
                                    + book.title.slice(0, configs.search.title_limit_search) 
                                    + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                    + '<br><p class="author-search">'
                                    + book.author
                                    + '</p></b></a></li>'
                                );
                            }
                            i++;
                        } if (i == maxsearch) {
                            $('#data-search').append('<li><a href="/search/' + $('#search-box').val() + '" class="search-book-url"><u>' + i18n['See all'] + '<u></a></li>');
                            i++;
                        } else {
                            return false;
                        }
                    });
                    }
                }

                if (response.authors.total == 0) {
                    $('#data-search').append('<li><a href="#" class="bg-lightgray"><h5 class="m-0">' + i18n['AUTHOR'] + '</h5></a></li>');
                    $('#data-search').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
                } else {
                    $('#data-search').append('<li><a href="#"  class="bg-lightgray"><h5 class="m-0">' + i18n['AUTHOR'] + '</h5></a></li>');
                    var i = 0;
                    response.authors.data.forEach(function (book) {
                        if (i < maxsearch) {
                            if (book.image) {
                                $('#data-search').append('<li><a href="/books/'
                                    + book.id + '" class="search-book-url"><img src="'
                                    + book.image.web.thumbnail_path
                                    + '" class="search-img"><b class="book-search">'
                                    + book.title.slice(0, configs.search.title_limit_search) 
                                    + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                    + '<br><p class="author-search">'
                                    + book.author
                                    + '</p></b></a></li>'
                                );
                            } else {
                                $('#data-search').append('<li><a href="/books/'
                                    + book.id
                                    + '" class="search-book-url"><img src="/images/book_thumb_default.jpg", class="search-img"><b class="book-search">'
                                    + book.title.slice(0, configs.search.title_limit_search) 
                                    + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                    + '<br><p class="author-search">'
                                    + book.author
                                    + '</p></b></a></li>'
                                );
                            }
                            i++;
                        } if (i == maxsearch) {
                            $('#data-search').append('<li><a href="/search/' + $('#search-box').val() + '" class="search-book-url"><u>' + i18n['See all'] + '<u></a></li>');
                            i++;
                        } else {
                            return false;
                        }
                    });
                }

                if (response.descriptions.total == 0) {
                    $('#data-search').append('<li><a href="#" class="bg-lightgray"><h5 class="m-0">' + i18n['DESCRIPTION'] + '</h5></a></li>');
                    $('#data-search').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
                } else {
                    $('#data-search').append('<li><a href="#" class="bg-lightgray"><h5 class="m-0">' + i18n['DESCRIPTION'] + '</h5></a></li>');
                    var i = 0;
                    response.descriptions.data.forEach(function (book) {
                        if (i < maxsearch) {
                            if (book.image) {
                                $('#data-search').append('<li><a href="/books/'
                                    + book.id + '" class="search-book-url"><img src="'
                                    + book.image.web.thumbnail_path
                                    + '", class="search-img"><b class="book-search">'
                                    + book.title.slice(0, configs.search.title_limit_search) 
                                    + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                    + '<br><p class="author-search">'
                                    + book.author
                                    + '</p></b></a></li>'
                                );
                            } else {
                                $('#data-search').append('<li><a href="/books/'
                                    + book.id
                                    + '" class="search-book-url"><img src="/images/book_thumb_default.jpg", class="search-img"><b class="book-search">'
                                    + book.title.slice(0, configs.search.ttle_limit_search) 
                                    + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                    + '<br><p class="author-search">'
                                    + book.author
                                    + '</p></b></a></li>'
                                );
                            }
                            i++;
                        } if (i == maxsearch) {
                            $('#data-search').append('<li><a href="/search/' + $('#search-box').val() + '" class="search-book-url"><u>' + i18n['See all'] + '<u></a></li>');
                            i++;
                        } else {
                            return false;
                        }
                    });
                }

                if (response.users.total == 0) {
                    $('#data-search').append('<li><a href="#" class="bg-lightgray"><h5 class="m-0">' + i18n['USER'] + '</h5></a></li>');
                    $('#data-search').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
                } else {
                    $('#data-search').append('<li><a href="#" class="bg-lightgray"><h5 class="m-0">' + i18n['USER'] + '</h5></a></li>');
                    var i = 0;
                    response.users.data.forEach(function (user) {
                        if (i < maxsearch) {
                            if (user.avatar) {
                                $('#data-search').append('<li><a href="/users/'
                                    + user.id + '" class="search-book-url"><img src="'
                                    + user.avatar
                                    + '" class="avatar search-img owner-image-home img-circle"><b class="book-search">'
                                    + user.name.slice(0, configs.search.title_limit_search) 
                                    + (user.name.length > configs.search.title_limit_search ? "..." : "")
                                    + '<br><p class="author-search">'
                                    + user.office.area
                                    + '</p></b></a></li>'
                                );
                            } else {
                                $('#data-search').append('<li><a href="/users/'
                                    + user.id
                                    + '" class="avatar search-book-url"><img src="/images/user/icon_user_default.png" class="avatar search-img owner-image-home img-circle"><b class="book-search">'
                                    + user.name.slice(0, configs.search.title_limit_search) 
                                    + (user.name.length > configs.search.title_limit_search ? "..." : "")
                                    + '<br><p class="author-search">'
                                    + user.office.area
                                    + '</p></b></a></li>'
                                );
                            }
                            i++;
                        } if (i == maxsearch) {
                            $('#data-search').append('<li><a href="/search/' + $('#search-box').val() + '" class="search-book-url"><u>' + i18n['See all'] + '<u></a></li>');
                            i++;
                        } else {
                            return false;
                        }
                    });
                }
            }).fail(function (error) {
                $('#data-search').empty();
            });
        }
    }
}

if (typeof searchBooksGoogle === 'undefined') { 
    function searchBooksGoogle() {
        if ($('#search-book-google').val() == '') {
            $('#data-search-google').empty();
        } else {
            $.ajax({
                url: API_PATH + 'search-books?maxResults=20&q=' + $('#search-book-google').val(),
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                type: 'GET',
            }).done(function (response) {
                $('#data-search-google').empty();

                if (response.items.length) {
                    response.items.forEach(function (book) {
                        $('#data-search-google').append(
                            '<li><a target="_blank" href="'+ book.volumeInfo.previewLink + '">' + book.volumeInfo.title + '</a></li>'
                        );
                    });
                } else {
                    $('#data-search-google').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
                }
            }).fail(function (error) {
                $('#data-search-googles').empty();
            });
        }
    }
}
