// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var loginController = require('../controllers/login');
var callbackController = require('../controllers/callback');
var logoutController = require('../controllers/logout');

module.exports = {
    login: function (app) {
        app.use('/login', loginController);
    },
    callback: function (app) {
        app.use('/callback', callbackController);
    },
    logout: function (app) {
        app.use('/logout', logoutController);
    }
};
