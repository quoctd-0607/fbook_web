var express = require('express');
var router = express.Router();
var request = require('request');
var util = require('util');
var async = require('async');
var objectHeaders = require('../helpers/headers');
var localSession = require('../middlewares/localSession');
var authorize = require('../middlewares/authorize');

router.get('/waiting-request-edit-book', authorize.isAdmin, function (req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    request({
        url: req.configs.api_base_url + 'admin/waiting-update-book' + '/?page=' + page,
        headers: objectHeaders.headers({'Authorization': req.session.access_token})
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            try {
                var data = JSON.parse(body);
                res.render('admin/waiting_approve_edit_book', {
                    dataRequest: data,
                    pageTitle: 'Waiting Request Edit Book',
                    info: req.flash('info'),
                    error: req.flash('error'),
                });
            } catch (errorJSONParse) {
                res.redirect('back');
            }
        } else {
            res.redirect('back');
        }
    });
});

router.post('/approve-update-request/:id', authorize.isAdmin, function (req, res, next) {
    request.post({
        url: req.configs.api_base_url + 'admin/books/approve-request-edit/' + req.params.id,
        form: {},
        headers: objectHeaders.headers({'Authorization': req.session.access_token})
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            try {
                req.flash('info', 'Approve success');
                res.redirect('back');
            } catch (errorJSONParse) {
                res.redirect('back');
            }
        } else {
            if (response.statusCode == 401) {
                req.flash('error', 'Please login to approve this book');
                res.redirect('back');
            } else {
                req.flash('error', JSON.parse(body).message.description);
                res.redirect('back');
            }
        }
    });
});

router.get('/', authorize.isAdmin, function (req, res, next) {
    async.parallel({
        totalUser: (callback) => {
            request({
                url: req.configs.api_base_url + 'admin/count/users',
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var users = JSON.parse(body);
                        callback(null, users);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        },
        totalBook: (callback) => {
            request({
                url: req.configs.api_base_url + 'admin/count/books',
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var books = JSON.parse(body);
                        callback(null, books);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, 0);
                }
            });
        },
        totalCategory: (callback) => {
            request({
                url: req.configs.api_base_url + 'admin/count/categories',
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
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
    }, (error, result) => {
        if (error) {
            req.flash('error', 'Please try again');
            res.redirect('back');
        } else {
            res.render('admin/dashboard', {
                layout: 'admin/layout/admin_template',
                totalUser: result.totalUser.item,
                totalBook: result.totalBook.item,
                totalCategory: result.totalCategory.item,
                pageTitle: 'Admin Dashboard',
                info: req.flash('info'),
                error: req.flash('error'),
            });
        }
    });
});

module.exports = router;
