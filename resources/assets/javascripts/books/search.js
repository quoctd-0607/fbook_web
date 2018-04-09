$(function ($) {
    $('body').on('keyup', '#search-box', function (e) {
        $('.search-result').show();
        
        delay(function(){
            e.preventDefault();
            searchBooks();
        }, 500);
    });

    $('input[name="search-box"]').blur(function(){
        $(".search-result").hide();
        $(this).val('');
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

                if (response.titles.total == 0) {
                    $('#data-search').append('<li><a href="#"><h5>' + i18n['TITLE'] + '</h5></a></li>');
                    $('#data-search').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
                } else {
                    $('#data-search').append('<li><a href="#"><h5>' + i18n['TITLE'] + '</h5></a></li>');
                    response.titles.data.forEach(function (book) {
                        if (book.image) {
                            $('#data-search').append('<li><a href="/books/'
                                + book.id + '"><img src="'
                                + book.image.web.thumbnail_path
                                + '", class="owner-image-home img-thumbnail"><b class="book-search">'
                                + book.title.slice(0, configs.search.title_limit_search) 
                                + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                + '<br><p class="author-search">'
                                + book.author
                                + '</p></b></a></li>'
                            );
                        } else {
                            $('#data-search').append('<li><a href="/books/'
                                + book.id
                                + '"><img src="/images/book_thumb_default.jpg", class="owner-image-home img-thumbnail"><b class="book-search">'
                                + book.title.slice(0, configs.search.title_limit_search) 
                                + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                + '<br><p class="author-search">'
                                + book.author
                                + '</p></b></a></li>'
                            );
                        }
                    });
                }

                if (response.authors.total == 0) {
                    $('#data-search').append('<li><a href="#"><h5>' + i18n['AUTHOR'] + '</h5></a></li>');
                    $('#data-search').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
                } else {
                    $('#data-search').append('<li><a href="#"><h5>' + i18n['AUTHOR'] + '</h5></a></li>');
                    response.authors.data.forEach(function (book) {
                        if (book.image) {
                            $('#data-search').append('<li><a href="/books/'
                                + book.id + '"><img src="'
                                + book.image.web.thumbnail_path
                                + '", class="owner-image-home img-thumbnail"><b class="book-search">'
                                + book.title.slice(0, configs.search.title_limit_search) 
                                + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                + '<br><p class="author-search">'
                                + book.author
                                + '</p></b></a></li>'
                            );
                        } else {
                            $('#data-search').append('<li><a href="/books/'
                                + book.id
                                + '"><img src="/images/book_thumb_default.jpg", class="owner-image-home img-thumbnail"><b class="book-search">'
                                + book.title.slice(0, configs.search.title_limit_search) 
                                + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                + '<br><p class="author-search">'
                                + book.author
                                + '</p></b></a></li>'
                            );
                        }
                    });
                }

                if (response.descriptions.total == 0) {
                    $('#data-search').append('<li><a href="#"><h5>' + i18n['DESCRIPTION'] + '</h5></a></li>');
                    $('#data-search').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
                } else {
                    $('#data-search').append('<li><a href="#"><h5>' + i18n['DESCRIPTION'] + '</h5></a></li>');
                    response.descriptions.data.forEach(function (book) {
                        if (book.image) {
                            $('#data-search').append('<li><a href="/books/'
                                + book.id + '"><img src="'
                                + book.image.web.thumbnail_path
                                + '", class="owner-image-home img-thumbnail"><b class="book-search">'
                                + book.title.slice(0, configs.search.title_limit_search) 
                                + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                + '<br><p class="author-search">'
                                + book.author
                                + '</p></b></a></li>'
                            );
                        } else {
                            $('#data-search').append('<li><a href="/books/'
                                + book.id
                                + '"><img src="/images/book_thumb_default.jpg", class="owner-image-home img-thumbnail"><b class="book-search">'
                                + book.title.slice(0, configs.search.title_limit_search) 
                                + (book.title.length > configs.search.title_limit_search ? "..." : "")
                                + '<br><p class="author-search">'
                                + book.author
                                + '</p></b></a></li>'
                            );
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
