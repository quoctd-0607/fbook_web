// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var express = require('express');
var router = express.Router();
var request = require('request');
var util = require('util');
var async = require('async');
var objectHeaders = require('../helpers/headers');
var localSession = require('../middlewares/localSession');
var authorize = require('../middlewares/authorize');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var books = express();
books.use(cookieParser());
books.use(i18n.init);
books.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', localSession, function (req, res, next) {
    req.checkQuery('field', 'Invalid field').notEmpty().isAlpha();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send(res.__('There have been validation errors: ') + util.inspect(result.array()));
            return;
        } else {
            var page = req.query.page ? req.query.page : 1;
            var field = req.query.field;
            var langCategory = req.cookies.lang;
            var url = req.configs.api_base_url + 'books/?field=' + field + '&page=' + page;

            if (req.query.officeId) {
                url += '&office_id=' + req.query.officeId;
            }

            async.parallel({
                section: function (callback) {
                    request({
                        url: url,
                        headers: objectHeaders.headers
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                var section = JSON.parse(body);
                                callback(null, section);
                            } catch (errorJSONParse) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    });
                },
                categories: function (callback) {
                    request({
                        url: req.configs.api_base_url + 'categories',
                        headers: objectHeaders.headers
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                var categories = JSON.parse(body);
                                callback(null, categories);
                            } catch (errorJSONParse) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    });
                },
                sortBookBy: function (callback) {
                    request({
                        url: req.configs.api_base_url + 'books/sort-by',
                        headers: objectHeaders.headers
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                var sortBookBy = JSON.parse(body);
                                callback(null, sortBookBy);
                            } catch (errorJSONParse) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    });
                }
            }, function (err, results) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.render('books/section', {
                        langCategory: langCategory,
                        field: field,
                        officeId: req.query.officeId,
                        section: results.section,
                        categories: results.categories,
                        sortBookBy: results.sortBookBy,
                        error: req.flash('error'),
                        info: req.flash('info')
                    });
                }
            });
        }
    });
});

router.get('/add', authorize.isAuthenticated, function (req, res, next) {
    var langCategory = req.cookies.lang;
    async.parallel({
        offices: function (callback) {
            request({
                url: req.configs.api_base_url + 'offices',
                headers: objectHeaders.headers
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var offices = JSON.parse(body);
                        callback(null, offices);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        },
        categories: function (callback) {
            request({
                url: req.configs.api_base_url + 'categories',
                headers: objectHeaders.headers
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var categories = JSON.parse(body);
                        callback(null, categories);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        }
    }, function (err, results) {
        if (err) {
            res.redirect('back');
        } else {
            res.render('books/add', {
                langCategory: langCategory,
                categories: results.categories,
                offices: results.offices,
                officeId: req.session.office_id
            });
        }
    });
});

router.get('/waiting_approve', authorize.isAuthenticated, function (req, res, next) {
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send(res.__('There have been validation errors: ') + util.inspect(result.array()));
            return;
        } else {
            var langCategory = req.cookies.lang;
            async.parallel({
                books: function (callback) {
                    request({
                        url: req.configs.api_base_url + 'user/books/waiting_approve',
                        headers: objectHeaders.headers({'Authorization': req.session.access_token})
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                books = JSON.parse(body);
                                callback(null, books);
                            } catch (errorJSONParse) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    });
                },
                data: function (callback) {
                    request({
                        url: req.configs.api_base_url + 'user/' + 129 + '/approve/detail',
                        headers: objectHeaders.headers({'Authorization': req.session.access_token})
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                var data = JSON.parse(body);

                                callback(null, data);
                            } catch (errorJSONParse) {
                                req.flash('error', res.__('Don\'t allow show approve request page'));
                                res.redirect('back');
                            }
                        } else {
                            req.flash('error', res.__('Don\'t allow show approve request page'));
                            res.redirect('back');
                        }
                    });
                }
            }, function (err, results) {
                if (err) {
                    res.redirect('back');
                } else {
                    res.render('books/waiting_approve', {
                        data: results.data,
                        books: results.books,
                        langCategory: langCategory,
                        pageTitle: res.__('Waiting approve'),
                        info: req.flash('info'),
                        error: req.flash('error'),
                    });
                }
            });
        }
    });
});

router.get('/:id/approve-request/:request', authorize.isAuthenticated, function (req, res, next) {
    var currentRequest = req.params.request;
    var langCategory = req.cookies.lang;
    req.checkParams('id', 'Invalid id').notEmpty().isInt();
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send(res.__('There have been validation errors: ') + util.inspect(result.array()));
            return;
        } else {
            request({
                url: req.configs.api_base_url + 'user/' + req.params.id + '/approve/detail',
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var data = JSON.parse(body);
                        var activeRequestReturning = false;
                        var activeRequestWaiting = false;
                        if (currentRequest ==  req.configs.notification.returning) {
                            activeRequestReturning = true;
                        } else {
                            activeRequestWaiting = true;
                        }
                        
                        res.render('books/approve_user', {
                            data: data,
                            pageTitle: 'Approve requests',
                            activeRequestReturning: activeRequestReturning,
                            activeRequestWaiting: activeRequestWaiting
                        });
                    } catch (errorJSONParse) {
                        req.flash('error', res.__('Don\'t allow show approve request page'));
                        res.redirect('back');
                    }
                } else {
                    req.flash('error', res.__('Don\'t allow show approve request page'));
                    res.redirect('back');
                }
            });
        }
    });
});

router.get('/:id', localSession, function (req, res, next) {
    var langCategory = req.cookies.lang;
    req.checkParams('id', 'Invalid id').notEmpty().isInt();
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send(res.__('There have been validation errors: ') + util.inspect(result.array()));
            return;
        } else {
            if (typeof req.session.book_detail_key === 'undefined') {
                request({
                    url: req.configs.api_base_url + 'books/' + req.params.id + '/increase-view',
                    headers: objectHeaders.headers({'Authorization': req.session.access_token})
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        try {
                            req.session.book_detail_key = Math.random().toString(36).substring(7);
                            res.redirect(req.params.id);
                        } catch (errorJSONParse) {
                            res.redirect('back');
                        }
                    } else {
                        res.redirect('back');
                    }
                });
            } else {
                request({
                    url: req.configs.api_base_url + 'books/' + req.params.id,
                    headers: objectHeaders.headers({'Authorization': req.session.access_token})
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        try {
                            var data = JSON.parse(body);
                            var currentUserReview = null;
                            var returnBookForOwner = null;
                            var cancelBookForOwner = null;
                            var returningBookToOwner = null;
                            var messages = req.flash('errors');
                            var langCategory = req.cookies.lang;
                            var btnBooking = {
                                'text': res.__('Want to Read'),
                                'status': req.configs.book_user.status.waiting
                            };
                            if (typeof req.session.user !== 'undefined') {
                                if (data.item.reviews_detail.length > 0) {
                                    data.item.reviews_detail.forEach (function (review) {
                                        if (review.user.id === req.session.user.id) {
                                            currentUserReview = review;
                                            return;
                                        }
                                    });
                                }
                                if (data.item.users_reading) {
                                    data.item.users_reading.forEach (function (userReading) {
                                        data.item.owners.forEach (function (owner) {
                                            if (userReading.id === req.session.user.id) {
                                                btnBooking = {
                                                    'text': res.__('Want to Return'),
                                                    'status': req.configs.book_user.status.returning
                                                };
                                                if (userReading.owner_id === owner.id) {
                                                    returnBookForOwner = owner;
                                                }
                                                return;
                                            }
                                        });
                                    });
                                }
                                if (data.item.users_waiting) {
                                    data.item.users_waiting.forEach (function (userWaiting) {
                                        data.item.owners.forEach (function (owner) {
                                            if (userWaiting.id === req.session.user.id) {
                                                btnBooking = {
                                                    'text': res.__('Cancel waiting this book'),
                                                    'status': req.configs.book_user.status.cancel_waiting
                                                };
                                                if (userWaiting.owner_id === owner.id) {
                                                    cancelBookForOwner = owner;
                                                }
                                                return;
                                            }
                                        });
                                    });
                                }
                                if (data.item.users_returning) {
                                    data.item.users_returning.forEach (function (userReturning) {
                                        data.item.owners.forEach (function (owner) {
                                            if (userReturning.id === req.session.user.id) {
                                                btnBooking = {
                                                    'text': res.__('You are returning this book'),
                                                    'status': req.configs.book_user.status.returned
                                                };
                                                if (userReturning.owner_id === owner.id) {
                                                    returningBookToOwner = owner;
                                                }
                                                return;
                                            }
                                        });
                                    });
                                }
                            }

                            data.item.btn_booking = btnBooking;
                            data.item.current_user_review = currentUserReview;
                            data.item.return_book_for_owner = returnBookForOwner;
                            data.item.cancel_book_for_owner = cancelBookForOwner;
                            data.item.returning_book_to_owner = returningBookToOwner;
                            res.render('books/detail', {
                                data: data,
                                langCategory: langCategory,
                                pageTitle: 'Detail',
                                officeId: data.item.office.id,
                                messages: messages,
                                error: req.flash('error'),
                                info: req.flash('info'),
                                book_current : req.params.id
                            });
                        } catch (errorJSONParse) {
                            req.flash('error', res.__('Sorry, something went wrong'));
                            res.redirect('back');
                        }
                    } else {
                        req.flash('error', res.__('Sorry, something went wrong'));
                        res.redirect('back');
                    }
                });
            }
        }
    });
});

router.get('/category/:category_id', localSession, function (req, res, next) {
    req.checkParams('category_id', 'Invalid category').notEmpty().isInt();

    var page = req.query.page ? req.query.page : 1;
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send(res.__('There have been validation errors: ') + util.inspect(result.array()));
            return;
        } else {
            var langCategory = req.cookies.lang;
            async.parallel({
                books: function (callback) {
                    request({
                        url: req.configs.api_base_url + 'books/category/' + req.params.category_id + '/?page=' + page,
                        headers: objectHeaders.headers
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                var books = JSON.parse(body);
                                callback(null, books);
                            } catch (errorJSONParse) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    });
                },
                categories: function (callback) {
                    request({
                        url: req.configs.api_base_url + 'categories',
                        headers: objectHeaders.headers
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                var categories = JSON.parse(body);
                                callback(null, categories);
                            } catch (errorJSONParse) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    });
                },
                sortBookBy: function (callback) {
                    request({
                        url: req.configs.api_base_url + 'books/sort-by',
                        headers: objectHeaders.headers
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                var sortBookBy = JSON.parse(body);
                                callback(null, sortBookBy);
                            } catch (errorJSONParse) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    });
                }
            }, function (err, results) {
                if (err) {
                    res.redirect('back');
                } else {
                    res.render('books/category', {
                        langCategory: langCategory,
                        books: results.books,
                        categories: results.categories,
                        sortBookBy: results.sortBookBy,
                    });
                }
            });
        }
    });
});

router.post('/review/:id', authorize.isAuthenticated, function (req, res, next) {
    req.checkBody('content').notEmpty().len(1, 255);
    var langCategory = req.cookies.lang;

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            req.flash('errors', result.array());
            res.redirect('/books/' + req.params.id + '#form-review');
        } else {
            var star = req.body.star != 0 ? req.body.star : 1;
            request.post({
                url: req.configs.api_base_url + 'books/review/' + req.params.id,
                form: {
                    'item':
                    {
                        'content': req.body.content,
                        'star': star
                    }
                },
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        req.flash('info', res.__('Thank for your review'));
                        res.redirect('back');
                    } catch (errorJSONParse) {
                        res.redirect('back');
                    }
                } else {
                    if (response.statusCode == 401) {
                        req.flash('error', res.__('Please login to review this book'));
                        res.redirect('back');
                    } else {
                        req.flash('error', res.__('Don\'t allow review this book'));
                        res.redirect('back');
                    }
                }
            });
        }
    });
});

router.post('/booking/:id', authorize.isAuthenticated, function (req, res, next) {
    var langCategory = req.cookies.lang;
    req.checkParams('id', 'Invalid book_id').notEmpty().isInt();
    req.checkBody('owner_id', 'Invalid owner_id').notEmpty().isInt();
    req.checkBody('status', 'Invalid status').notEmpty().isInt();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            req.flash('errors', result.array());
            res.redirect('/books/' + req.params.id + '#form-review');
        } else {
            var form = {
                item: {
                    book_id: req.params.id,
                    owner_id: req.body.owner_id,
                    status: req.body.status,
                    days_to_read: req.body.days_to_read
                }
            };
            request.post({
                url: req.configs.api_base_url + 'books/booking',
                form: form,
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        req.flash('info', res.__('Booking success'));
                        res.redirect('back');
                    } catch (errorJSONParse) {
                        res.redirect('back');
                    }
                } else {
                    if (response.statusCode === 401) {
                        req.flash('error', res.__('Please login to booking this book'));
                        res.redirect('back');
                    } else if (response.statusCode === 500) {
                        req.flash('error', res.__('You can\'t booking book which you owned'));
                        res.redirect('back');
                    } else {
                        req.flash('error', res.__('Don\'t allow booking this book'));
                        res.redirect('back');
                    }
                }
            });
        }
    });
});

router.get('/:id/edit', authorize.isAuthenticated, function (req, res, next) {
    var langCategory = req.cookies.lang;
    async.parallel({
        offices: function (callback) {
            request({
                url: req.configs.api_base_url + 'offices',
                headers: objectHeaders.headers
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var offices = JSON.parse(body);
                        callback(null, offices);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        },
        categories: function (callback) {
            request({
                url: req.configs.api_base_url + 'categories',
                headers: objectHeaders.headers
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var categories = JSON.parse(body);
                        callback(null, categories);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        },
        book: function (callback) {
            request({
                url: req.configs.api_base_url + 'books/' + req.params.id,
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var book = JSON.parse(body);
                        callback(null, book);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        }
    }, function (err, results) {
        if (err) {
            res.redirect('back');
        } else {
            res.render('books/edit', {
                langCategory: langCategory,
                categories: results.categories,
                offices: results.offices,
                officeId: req.session.office_id,
                book: results.book
            });
        }
    });
});

//write new review
router.get('/:id/review', authorize.isAuthenticated, (req, res, next) => {
    var langCategory = req.cookies.lang;
    {
        request({
            url: req.configs.api_base_url + 'books/' + req.params.id,
            headers: objectHeaders.headers
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                try {
                    var data = JSON.parse(body);
                    var messages = req.flash('errors');
                    res.render('books/write_review', {
                        data: data,
                        pageTitle: 'Write review',
                        messages: messages,
                        error: req.flash('error'),
                        info: req.flash('info'),
                        book_current : req.params.id,
                        userId: req.session.user.id
                    });
                } catch (errorJSONParse) {
                    req.flash('error', res.__('Don\'t allow show this book'));
                    res.redirect('back');
                }
            } else {
                req.flash('error', res.__('Don\'t allow show this book'));
                res.redirect('back');
            }
        });
    }

});

router.post('/post-review/:id', urlencodedParser, (req, res, next) => {
    request.post({
        url: req.configs.api_base_url + 'books/new-review/' + req.params.id,
        form: {
            'item':
            {
                'title' : req.body.review_title,
                'content': req.body.review_content,
                'star':  req.body.review_start
            }
        },
        headers: objectHeaders.headers({'Authorization': req.session.access_token})
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            req.flash('info', res.__('Thanks for review'));
                res.redirect(`../../books/${req.params.id}`);
        } else {
            req.flash('error', res.__('Please fillout all review\'s content'));
            res.redirect('back');
        }
    })

});

router.get('/view-review/:id', authorize.isAuthenticated, localSession, (req, res, next) => {
    var langCategory = req.cookies.lang;
    request({
        url: req.configs.api_base_url + 'books/review-details/' + req.params.id + '/' + req.session.user.id,
        headers: objectHeaders.headers({'Authorization': req.session.access_token})
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            var messages = req.flash('errors')
            res.render('books/review_details', {
                data : data,
                messages: messages,
                error: req.flash('error'),
                info: req.flash('info'),
                userId : req.session.user.id
            });
        } else {
            req.flash('error', res.__('This review not available'));
            res.redirect('back');
        }
    });
});

router.post('/review-details/comment', urlencodedParser , (req, res, next) => {
    request.post({
        url: req.configs.api_base_url + 'books/review-details/comment',
        form: {
            'item':
            {
                'userId' : req.body.review_user_id,
                'reviewId': req.body.review_review_id,
                'content':  req.body.review_content
            }
        },
        headers: objectHeaders.headers({'Authorization': req.session.access_token})
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            req.flash('info', res.__('Thanks for your comment'));
            res.redirect('back');
        } else {
            req.flash('error', res.__('Can\'t add your comment, something went wrong'));
            res.redirect('back');
        }
    })
});

module.exports = router;
