$(function ($) {
    $('body').on('keyup', '#search-book', function (e) {
        delay(function(){
            e.preventDefault();
            searchBooks();
        }, 500);
    });

    $('body').on('keyup', '#search-book-google', function (e) {
        delay(function(){
            e.preventDefault();
            searchBooksGoogle();
        }, 500);
    });

    $('input[name="type-search"]').on('change', function (e) {
        e.preventDefault();
        searchBooks();
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
        if ($('#search-book').val() == '') {
            $('#data-search').empty();
        } else {
            $.ajax({
                url: API_PATH + 'search',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                type: 'POST',
                data: JSON.stringify({
                    search: {
                        keyword: $('#search-book').val(),
                        field: $('input[name="type-search"]:checked').val()
                    }
                }),
            }).done(function (response) {
                $('#data-search').empty();

                if (response.items.total) {
                    response.items.data.forEach(function (book) {
                        $('#data-search').append('<li><a href="/books/'+ book.id +'">' + book.title + '</a></li>');
                    });
                } else {
                    $('#data-search').append('<li><a href="#">' + i18n['Not found'] + '</a></li>');
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
