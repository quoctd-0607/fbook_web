// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var request = require('request');
var express = require('express');
var session = require('express-session');
var objectHeaders = require('../helpers/headers');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var app = express();
app.use(cookieParser());
app.use(i18n.init);
app.set('view engine', 'ejs');

module.exports = {
    isAuthenticated: function (req, res, next) {
        if (typeof req.session.user === 'undefined' || typeof req.session.access_token === 'undefined') {
            req.flash('error', res.__('Please login'));

            return res.redirect('back');
        }

        res.locals.user = req.session.user;
        res.locals.access_token = req.session.access_token;
        res.locals.refresh_token = req.session.refresh_token;

        next();
    },
    isAdmin: function (req, res, next) {
        if (typeof req.session.user === 'undefined' || typeof req.session.access_token === 'undefined') {
            req.flash('error', res.__('Please login'));

            return res.redirect('/');
        }

        if (req.session.user.role != 'admin' && req.session.user.role != 'librarian') {
            req.flash('error', res.__('Not Admin'));

            return res.redirect('/');
        }

        res.locals.user = req.session.user;
        res.locals.access_token = req.session.access_token;
        res.locals.refresh_token = req.session.refresh_token;

        next();
    }
};
