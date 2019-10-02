// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var express = require('express');
var request = require('request');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var objectHeaders = require('../helpers/headers');
var router = express.Router();
var cookieParser = require('cookie-parser');
var i18n = require("i18n");
var callback = express();
callback.use(cookieParser());
callback.use(i18n.init);
callback.set('view engine', 'ejs');

router.get('/', function(req, res, next) {
    if (!req.session.access_token) {
        request.post({
            headers: objectHeaders.urlencodedHeaders,
            url:     req.configs.auth_server_authorization_code_url + '/auth/access_token',
            body:    "client_id=" + req.configs.client_id + "&client_secret="
                + req.configs.client_secret + '&code=' + req.query.code
        }, function(error, response, body){
            if (!error && response.statusCode === 200) {
                try {
                    var data = JSON.parse(body);

                    if (data.hasOwnProperty('access_token')) {
                        req.session.access_token = data.access_token;
                        req.session.refresh_token = data.refresh_token;
                        request({
                            url: req.configs.api_base_url + 'user-profile',
                            headers: objectHeaders.headers({'Authorization': data.access_token})
                        }, function (error, response, body) {
                            if (!error && response.statusCode === 200) {
                                try {
                                    var user = JSON.parse(body);

                                    req.session.user = user.item;
                                    req.session.office_id = user.item.office_id;
                                    req.flash('info', res.__('Login success'));
                                    request({
                                        url: req.configs.api_base_url + 'offices',
                                        headers: objectHeaders.headers
                                    }, function (error, response, body) {
                                        if (!error && response.statusCode === 200) {
                                            try {
                                                var offices = JSON.parse(body);
                                                req.app.locals.offices = offices;
                                                if (req.header('Referer') == req.configs.url_sign_in_auth_server) {
                                                    return res.redirect('home');
                                                }

                                                if (req.get('referer') == req.protocol + "://" + req.get('host') + "/home"
                                                    || req.get('referer') == req.protocol + "://" + req.get('host') + "/") {
                                                    if (!user.item.office_id) {
                                                        res.redirect('home/all_office');
                                                    } else {
                                                        res.redirect('home?officeId=' + user.item.office_id);
                                                    }
                                                } else {
                                                    res.redirect('back');
                                                }
                                            } catch (errorJSONParse) {
                                                req.flash('error', res.__('Can\'t load offices'));
                                                res.redirect('back');
                                            }
                                        } else {
                                            req.flash('error', res.__('Can\'t load offices'));
                                            res.redirect('back');
                                        }
                                    });
                                } catch (errsorJSONParse) {
                                    req.flash('error', res.__('Login fail'));
                                    res.redirect('home');
                                }
                            } else {
                                req.flash('error', res.__('Login fail'));
                                res.redirect('home');
                            }
                        });
                    }
                } catch (errorJSONParse) {
                    req.flash('error', res.__('Login fail'));
                    res.redirect('home');
                }
            } else {
                req.flash('error', res.__('Login fail'));
                res.redirect('home');
            }
        });
    } else {
        res.redirect('home');
    }
});

module.exports = router;
