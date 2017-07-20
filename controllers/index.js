var express = require('express');
var router = express.Router();
var request = require('request');
var objectHeaders = require('../helpers/headers');
var localSession = require('../middlewares/localSession');
var async = require('async');

router.get('/', localSession, function (req, res, next) {
    var url = req.configs.api_base_url + 'home/';

    if (typeof(req.query.officeId) !== 'undefined') {
        url = req.configs.api_base_url + 'home?office_id=' + req.query.officeId;
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
                    officeId: req.query.officeId,
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

module.exports = router;
