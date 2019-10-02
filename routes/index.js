// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var indexController = require('../controllers/index');

var index = function (app) {
    app.use('/home', indexController);
    app.use('/', indexController);
};

module.exports = index;
