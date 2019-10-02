// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var session = require('express-session');

localSession = function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.access_token = req.session.access_token;

    next();
};

module.exports = localSession;
