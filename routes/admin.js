// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var adminController = require('../controllers/admin');

var admin = function (app) {
    app.use('/admin', adminController);
};

module.exports = admin;
