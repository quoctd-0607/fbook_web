var express = require('express');
var router = express.Router();
var request = require('request');
var objectHeaders = require('../helpers/headers');
var localSession = require('../middlewares/localSession');
var async = require('async');

router.get('/', localSession, function (req, res, next) {
    var url = req.configs.api_base_url + 'home/';
    var officeId;

    if (typeof(req.session.office_id) !== 'undefined' && req.session.office_id != null) {
        url = req.configs.api_base_url + 'home?office_id=' + req.session.office_id;
        officeId = req.session.office_id;
    }

    if (typeof(req.query.officeId) !== 'undefined') {
        url = req.configs.api_base_url + 'home?office_id=' + req.query.officeId;
        officeId = req.query.officeId;
    }

    request({
        url: url,
        headers: objectHeaders.headers
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            try {
                var data = JSON.parse(body);

                res.render('index', {
                    data: data,
                    officeId: officeId,
                    pageTitle: 'Home',
                    isHomePage: true,
                    info: req.flash('info'),
                    error: req.flash('error'),
                    lang : req.session.lang
                });
            } catch (errorJSONParse) {
                res.redirect('home');
            }
        } else {
            res.redirect('home');
        }
    });
});

router.get('/all_office', localSession, function (req, res, next) {
    var url = req.configs.api_base_url + 'home/';
    var officeId;

    request({
        url: url,
        headers: objectHeaders.headers
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            try {
                var data = JSON.parse(body);

                res.render('index', {
                    data: data,
                    officeId: officeId,
                    pageTitle: 'Home',
                    isHomePage: true,
                    info: req.flash('info'),
                    error: req.flash('error'),
                });
            } catch (errorJSONParse) {
                res.redirect('home');
            }
        } else {
            res.redirect('home');
        }
    });
});

router.get('/change-lang/:lang', function(req, res) {
    res.cookie('lang', req.params.lang, { maxAge: 900000 , httpOnly: true});
    req.session.lang = req.params.lang;
    res.redirect('back');
});

module.exports = router;
